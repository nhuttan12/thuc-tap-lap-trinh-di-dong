import requests

proxies = {
    "http":  "http://u1:p1@103.1.2.3:8080",
    "https": "http://u1:p1@103.1.2.3:8080",
}

try:
    r = requests.get(
        "https://supersports.com.vn/collections/nam?page=1",
        proxies=proxies,
        timeout=10,
    )
    print("OK", r.status_code)
except Exception as e:
    print("FAIL", e)