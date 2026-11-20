import os
import math
from PIL import Image, ImageDraw, ImageFont

img_dir = os.path.join(os.path.dirname(__file__), "img")
os.makedirs(img_dir, exist_ok=True)

dishes_config = [
    # Hero & Covers
    ("hero-cover.jpg", "5 ЧУВСТВ", (55, 34, 22), (32, 18, 12), "☕🥐🌿"),
    
    # Coffee
    ("cappuccino.jpg", "Капучино", (210, 145, 95), (140, 75, 40), "☕"),
    ("latte.jpg", "Латте", (215, 160, 110), (150, 95, 55), "🥛"),
    ("espresso.jpg", "Эспрессо", (85, 45, 26), (42, 20, 10), "⚡"),
    ("flat-white.jpg", "Флэт Уайт", (190, 125, 75), (120, 68, 30), "☕"),
    ("americano.jpg", "Американо", (110, 65, 38), (60, 32, 16), "☕"),

    # Signatures
    ("bumble-coffee.jpg", "Бамбл", (235, 125, 35), (170, 70, 18), "🍊"),
    ("raf-lavender.jpg", "Лавандовый Раф", (155, 115, 175), (98, 62, 122), "🪻"),
    ("raf-citrus.jpg", "Цитрусовый Раф", (225, 145, 45), (165, 88, 22), "🍋"),
    ("matcha-latte.jpg", "Матча Латте", (80, 140, 90), (48, 92, 58), "🍵"),
    ("cacao-marshmallow.jpg", "Горячий шоколад", (95, 50, 32), (52, 26, 16), "🍫"),

    # Tea & Cold
    ("tea-sea-buckthorn.jpg", "Облепиховый чай", (235, 135, 25), (175, 80, 12), "🫖"),
    ("tea-mulled-wine.jpg", "Ягодный глинтвейн", (165, 38, 58), (98, 16, 32), "🍒"),
    ("lemonade-tarragon.jpg", "Тархун-Лайм", (65, 145, 95), (32, 88, 52), "🌿"),
    ("fresh-orange.jpg", "Фреш апельсин", (245, 135, 25), (195, 80, 12), "🍊"),

    # Breakfasts
    ("syrniki-berry.jpg", "Сырники с малиной", (220, 75, 100), (150, 38, 65), "🥞"),
    ("syrniki-caramel.jpg", "Сырники с карамелью", (215, 140, 55), (150, 85, 28), "🍌"),
    ("toast-avocado.jpg", "Авокадо-тост", (90, 140, 80), (48, 95, 48), "🥑"),
    ("brioche-salmon.jpg", "Бриошь с лососем", (235, 110, 85), (165, 58, 42), "🐟"),
    ("english-breakfast.jpg", "Большой завтрак", (195, 80, 45), (125, 42, 22), "🍳"),
    ("oat-porridge.jpg", "Овсяная каша", (190, 135, 85), (130, 82, 48), "🥣"),

    # Sandwiches & Bowls
    ("croissant-turkey.jpg", "Круассан с индейкой", (190, 115, 60), (125, 68, 32), "🥐"),
    ("club-sandwich.jpg", "Клаб-сэндвич", (210, 125, 50), (140, 72, 28), "🥪"),
    ("ciabatta-parma.jpg", "Чиабатта с прошутто", (180, 90, 65), (115, 48, 36), "🥖"),
    ("bowl-quinoa-avocado.jpg", "Зеленый боул", (80, 135, 85), (42, 88, 52), "🥗"),

    # Desserts
    ("croissant-classic.jpg", "Круассан классический", (220, 155, 80), (155, 98, 42), "🥐"),
    ("croissant-almond.jpg", "Миндальный круассан", (200, 135, 70), (140, 82, 38), "🌰"),
    ("tart-pistachio.jpg", "Фисташковый тарт", (125, 150, 95), (68, 98, 52), "🥧"),
    ("cheesecake-san-sebastian.jpg", "Баскский чизкейк", (215, 145, 70), (150, 88, 38), "🍰"),
    ("eclair-vanilla.jpg", "Эклер Ваниль", (205, 160, 95), (145, 98, 48), "🧁"),
    ("macarons-set.jpg", "Набор макаронс", (210, 95, 135), (145, 48, 85), "🍬"),

    # Combos
    ("combo-morning.jpg", "Комбо Идеальное утро", (215, 100, 65), (140, 52, 32), "☕🥞"),
    ("combo-business.jpg", "Комбо Бизнес-завтрак", (185, 95, 50), (120, 52, 28), "☕🥐"),
    ("combo-sweet.jpg", "Комбо Сладкая пара", (200, 125, 70), (135, 72, 38), "☕🥐")
]

def create_image(filename, name, c1, c2, icon):
    w, h = 600, 450
    if filename == "hero-cover.jpg":
        w, h = 1200, 420

    img = Image.new("RGB", (w, h), (250, 247, 242))
    draw = ImageDraw.Draw(img)

    # Soft radial background gradient
    cx, cy = w // 2, h // 2
    max_r = math.sqrt(cx**2 + cy**2)
    
    for r in range(int(max_r), 0, -8):
        factor = r / max_r
        # Blend from warm beige to rich theme color
        cr = int(c1[0] * factor + 253 * (1 - factor))
        cg = int(c1[1] * factor + 250 * (1 - factor))
        cb = int(c1[2] * factor + 245 * (1 - factor))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(cr, cg, cb))

    # Outer decorative coffee rings & organic flourishes
    draw.ellipse([cx - 190, cy - 180, cx + 190, cy + 180], outline=(255, 255, 255, 120), width=3)
    draw.ellipse([cx - 210, cy - 200, cx + 210, cy + 200], outline=(255, 255, 255, 60), width=1)

    # Ceramic plate shadow
    plate_r = 135
    draw.ellipse([cx - plate_r + 4, cy - plate_r + 8, cx + plate_r + 4, cy + plate_r + 8], fill=(36, 23, 16, 40))

    # Ceramic plate base (soft warm porcelain)
    draw.ellipse([cx - plate_r, cy - plate_r, cx + plate_r, cy + plate_r], fill=(255, 255, 255), outline=(238, 230, 220), width=3)
    # Inner rim
    draw.ellipse([cx - plate_r + 14, cy - plate_r + 14, cx + plate_r - 14, cy + plate_r - 14], fill=(252, 249, 245), outline=(225, 215, 200), width=1)
    
    # Try loading Windows Segoe UI Emoji font
    try:
        font_icon = ImageFont.truetype("C:/Windows/Fonts/seguiemj.ttf", 96 if len(icon) <= 2 else 68)
        font_watermark = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 12)
    except Exception:
        font_icon = ImageFont.load_default()
        font_watermark = ImageFont.load_default()

    # Draw centered icon
    try:
        bbox = draw.textbbox((0, 0), icon, font=font_icon)
        iw = bbox[2] - bbox[0]
        ih = bbox[3] - bbox[1]
        draw.text((cx - iw // 2, cy - ih // 2 - 2), icon, font=font_icon, embedded_color=True)
    except Exception:
        draw.text((cx - 30, cy - 30), "☕", fill=(140, 70, 30))

    # Tasteful watermark at bottom of dish showcase
    draw.text((w // 2 - 50, h - 28), "5 ЧУВСТВ", fill=(175, 160, 145), font=font_watermark)

    out_path = os.path.join(img_dir, filename)
    img.save(out_path, "JPEG", quality=94)
    print(f"Generated {filename}")

for item in dishes_config:
    create_image(*item)

print("All new clean showcase images generated!")
