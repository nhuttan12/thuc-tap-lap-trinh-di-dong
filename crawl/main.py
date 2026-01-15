import asyncio
import csv
import random
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright
import os

BASE_URL = "https://giaynhatchinhhang.vn/giay-adidas"
UA_LIST = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
]


async def fetch_detail(page, url):
    print(f"[DETAIL] Fetching: {url}")
    await page.goto(url, timeout=60000, wait_until="domcontentloaded")
    await asyncio.sleep(random.uniform(1.2, 2.2))
    return await page.content()


def extract_product_detail(html):
    soup = BeautifulSoup(html, "html.parser")

    # Giá sau giảm
    sale_price_tag = soup.select_one(".special-price .product-price")
    sale_price = sale_price_tag.get_text(strip=True) if sale_price_tag else ""

    # Giá gốc
    original_price_tag = soup.select_one(".old-price .product-price-old")
    original_price = (
        original_price_tag.get_text(strip=True) if original_price_tag else ""
    )

    # Thương hiệu
    brand_el = soup.select_one("span.first_status span.status_name")
    brand = brand_el.get_text(strip=True) if brand_el else ""

    # Danh sách size
    sizes = [x.get_text(strip=True) for x in soup.select(".swatch-element label")]

    # Hình ảnh chi tiết
    detail_images = []

    # Lấy từ data-image trong gallery
    for a in soup.select("#gallery_02 a[data-image]"):
        url = a.get("data-image")
        if url:
            if url.startswith("//"):
                url = "https:" + url
            detail_images.append(url)

    # Chuyển thành chuỗi, cách nhau bằng ;
    detail_images_str = ";".join(detail_images)

    # ⭐ THÊM: CRAWL DESCRIPTION ⭐
    description = extract_description(soup)

    return {
        "sale_price": sale_price,
        "original_price": original_price,
        "brand": brand,
        "sizes": sizes,
        "detail_images": detail_images_str,
        "description": description,
    }


def extract_products(html):
    soup = BeautifulSoup(html, "html.parser")
    items = soup.select("div.product-box")  # selector chính xác nhất
    results = []

    for item in items:
        # --- Lấy link chi tiết ---
        link_tag = item.select_one("div.product-thumbnail a")
        if not link_tag:
            continue

        url = urljoin(BASE_URL, link_tag["href"])

        # --- Lấy ảnh ---
        img_tag = item.select_one("div.product-thumbnail img")
        img_url = img_tag.get("src") or img_tag.get("data-src") or ""

        # Fix mất protocol //
        if img_url.startswith("//"):
            img_url = "https:" + img_url

        # --- Lấy tên sản phẩm ---
        title_tag = item.select_one("p.product-name a")
        title = title_tag.get_text(strip=True) if title_tag else "No title"

        # --- Vì HTML của bạn không có data-id, tự tạo id ---
        product_id = hash(url)

        results.append({"id": product_id, "title": title, "url": url, "image": img_url})

    return results


def extract_last_page(html):
    soup = BeautifulSoup(html, "html.parser")
    pages = soup.select("ul.pagination li a")
    if not pages:
        pages = soup.select(".pagination-page a")

    last_page = 1
    for p in pages:
        try:
            num = int(p.text.strip())
            last_page = max(last_page, num)
        except:
            pass

    return last_page


async def fetch_page(page, url):
    print(f"[INFO] Fetching: {url}")
    await page.goto(url, timeout=60000, wait_until="domcontentloaded")
    await asyncio.sleep(random.uniform(1.2, 2.0))
    return await page.content()


async def crawl():
    all_products = []

    async with async_playwright() as pw:
        ua = random.choice(UA_LIST)

        browser = await pw.chromium.launch(headless=False)
        context = await browser.new_context(user_agent=ua)
        page = await context.new_page()

        # Load trang đầu tiên để lấy số trang
        html = await fetch_page(page, BASE_URL)
        last_page = extract_last_page(html)

        print(f"[INFO] Total pages: {last_page}")

        # Crawl từng trang
        for p in range(1, 3):
            url = f"{BASE_URL}?page={p}"
            html = await fetch_page(page, url)
            products = extract_products(html)

            for prod in products:
                detail_html = await fetch_detail(page, prod["url"])
                detail = extract_product_detail(detail_html)

                prod.update(detail)  # ✔️ merge data detail vào product

                all_products.append(prod)

                print(f"  → Crawled detail for: {prod['title']}")
                await asyncio.sleep(random.uniform(1.5, 2.8))

            print(f"[PAGE {p}] Crawled {len(products)} products")

            await asyncio.sleep(random.uniform(1.5, 2.8))

        await browser.close()

    return all_products


def extract_description(soup):
    """
    Crawl nội dung chi tiết sản phẩm trong #tab-1 .rte
    Xử lý:
        - thẻ h* -> span
        - thẻ p -> span
        - thẻ ul -> li > span
    Kết quả ghép bằng dấu ';'
    """
    description_detail = []
    rte = soup.select_one("#tab-1 .rte")
    if not rte:
        return ""

    for el in rte.children:
        if el.name and el.name.lower().startswith("h"):
            span = el.select_one("span")
            if span:
                text = span.get_text(strip=True)
                if text:
                    description_detail.append(text)
        elif el.name == "p":
            span = el.select_one("span")
            if span:
                text = span.get_text(strip=True)
                if text:
                    description_detail.append(text)
        elif el.name == "ul":
            for li in el.select("li"):
                span = li.select_one("span")
                if span:
                    text = span.get_text(strip=True)
                    if text:
                        description_detail.append(text)

    return ";".join(description_detail)

def save_csv(data, filename="giay_adidas.csv"):
    if not data:
        print("No data to save.")
        return

    # XÓA FILE CŨ NẾU TỒN TẠI
    if os.path.exists(filename):
        os.remove(filename)

    keys = [
        "id",
        "title",
        "url",
        "image",
        "sale_price",
        "original_price",
        "brand",
        "sizes",
        "detail_images",
        "description",
    ]

    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(data)

    print(f"[INFO] CSV saved to {filename}")


async def main():
    data = await crawl()
    print(f"[INFO] Total products crawled: {len(data)}")
    save_csv(data)


if __name__ == "__main__":
    asyncio.run(main())
