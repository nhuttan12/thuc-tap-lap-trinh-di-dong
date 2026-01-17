import csv


def convert_colors(description: str) -> str:
    """
    Chuyển màu tiếng Anh sang tiếng Việt trong description,
    chuẩn hóa + loại trùng màu.
    """
    color_map = {
        "Blue Rush": "Xanh dương Rush",
        "Cloud White": "Trắng mây",
        "Core Black": "Đen lõi",
        "Carbon": "Carbon",
        "Gray": "Xám",
        "Grey One": "Xám mức 1",
        "Grey Five": "Xám mức 5",
        "Gray5": "Xám mức 5",
        "Gray4": "Xám mức 4",
        "Grey Strata": "Xám Strata",
        "Dark Blue": "Xanh đậm",
        "Lucid Blue": "Xanh lam Lucid",
        "Blue": "Xanh dương",
        "Green": "Xanh lá",
        "Spark Green": "Xanh lá Spark",
        "Silver Metallic": "Bạc ánh kim",
        "Iron Metallic": "Bạc đậm",
        "Gold Metallic": "Vàng ánh kim",
        "Halo Silver": "Bạc Halo",
        "Putty Mauve": "Hồng đất Putty",
        "Putty Beige": "Be Putty",
        "Preloved Fig": "Tím Preloved",
        "Wonder White": "Trắng Wonder",
        "Chalk White": "Trắng phấn",
        "Crystal White": "Trắng pha lê",
        "Lucid Red": "Đỏ Lucid",
        "Pink": "Hồng",
        "Pink Spark": "Hồng Spark",
        "Clear Pink": "Hồng trong suốt",
        "Oatmeal": "Yến mạch",
        "Olive Strata": "Xanh olive",
        "Shadow Olive": "Xanh olive tối",
        "Black Aurora": "Đen cực quang",
    }

    segments = description.split(";")
    for i, seg in enumerate(segments):
        if "Màu sản phẩm:" in seg:
            colors = seg.split(":", 1)[1].strip()
            color_list = [c.strip() for c in colors.split("/")]

            seen = set()
            converted = []

            for c in color_list:
                raw_key = c.replace(" ", "").lower()

                # Chuẩn hóa đặc biệt
                if raw_key in ["greyfive", "gray5"]:
                    key = "Grey Five"
                elif raw_key == "gray4":
                    key = "Gray4"
                elif "spark" in raw_key and "green" in raw_key:
                    key = "Spark Green"
                else:
                    key = None
                    for k in color_map:
                        if k.replace(" ", "").lower() == raw_key:
                            key = k
                            break

                final_color = color_map.get(key, c)

                if final_color not in seen:
                    seen.add(final_color)
                    converted.append(final_color)

            segments[i] = "Màu sản phẩm: " + " / ".join(converted)

    return ";".join(segments)


# ========= XỬ LÝ FILE CSV =========

input_file = "giay_adidas.csv"
output_file = "giay_adidas_pre_processed_v1.csv"

with open(input_file, newline="", encoding="utf-8") as fin, open(
    output_file, "w", newline="", encoding="utf-8"
) as fout:

    reader = csv.DictReader(fin)
    writer = csv.DictWriter(fout, fieldnames=reader.fieldnames)

    writer.writeheader()

    for row in reader:
        row["description"] = convert_colors(row["description"])
        writer.writerow(row)

print("✅ Hoàn tất! File mới:", output_file)
