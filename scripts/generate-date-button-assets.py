from __future__ import annotations

import calendar
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
PANEL_DIR = ROOT / "public/assets/omphalos/calendar-panels"
PANEL_CLEAN_DIR = ROOT / "public/assets/omphalos/calendar-panels-clean"
OUT_DIR = ROOT / "public/assets/omphalos/date-buttons"

# Shared 7x6 centers in the 1125x650 calendar panel coordinate system.
# Calibrated from the user-provided framed month references and the source panels.
GRID_X = [190.5, 316.5, 443.0, 569.0, 696.0, 824.5, 949.0]
GRID_Y = [132.0, 205.0, 279.0, 353.0, 427.0, 500.0]
TILE_W = 118
TILE_H = 66
REFERENCE_YEAR = 2026
MAX_DAYS = {
    1: 31,
    2: 29,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
}


MONTH_PANEL_FILES = {
    1: "01-janus-gate-month-calendar-panel.jpg",
    2: "02-talanton-balance-month-calendar-panel.jpg",
    3: "03-oronyx-long-night-month-calendar-panel.jpg",
    4: "04-georios-cultivation-month-calendar-panel.jpg",
    5: "05-phagousa-joy-month-calendar-panel.jpg",
    6: "06-aigle-long-day-month-calendar-panel.jpg",
    7: "07-kephale-freedom-month-calendar-panel.jpg",
    8: "08-cerces-harvest-month-calendar-panel.jpg",
    9: "09-mnemosyne-thread-month-calendar-panel.jpg",
    10: "10-nikadori-strife-month-calendar-panel.jpg",
    11: "11-thanatos-mourning-month-calendar-panel.jpg",
    12: "12-zagreus-chance-month-calendar-panel.jpg",
}

SPECIAL_SOURCE_CENTERS = {
    (11, 12): (696.0, 247.0),
}


def load_number_font() -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Times New Roman.ttf",
        "/System/Library/Fonts/Supplemental/Georgia.ttf",
        "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf",
    ]
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), 37)
    return ImageFont.load_default()


NUMBER_FONT = load_number_font()


def clean_panel(panel: Image.Image) -> Image.Image:
    """Remove baked-in date numbers while preserving the month-specific color field."""
    result = panel.convert("RGBA")
    left = round(GRID_X[0] - TILE_W / 2 - 8)
    top = 116
    right = round(GRID_X[-1] + TILE_W / 2 + 8)
    bottom = round(GRID_Y[-1] + TILE_H / 2 + 12)
    region_box = (left, top, right, bottom)

    region = result.crop(region_box)
    region = ImageEnhance.Contrast(region).enhance(0.56)
    region = ImageEnhance.Brightness(region).enhance(0.94)
    region = region.filter(ImageFilter.GaussianBlur(18))

    veil = Image.new("RGBA", region.size, (8, 10, 20, 28))
    region = Image.alpha_composite(region, veil)
    result.paste(region, region_box)
    return result.convert("RGB")


def crop_tile(panel: Image.Image, col: int, row: int) -> Image.Image:
    center_x = GRID_X[col]
    center_y = GRID_Y[row]
    return crop_tile_at(panel, center_x, center_y)


def crop_tile_at(panel: Image.Image, center_x: float, center_y: float) -> Image.Image:
    left = round(center_x - TILE_W / 2)
    top = round(center_y - TILE_H / 2)
    return panel.crop((left, top, left + TILE_W, top + TILE_H)).convert("RGBA")


def draw_framed_button(tile: Image.Image) -> Image.Image:
    # Keep the original local texture but make the button self-contained.
    tile = ImageEnhance.Contrast(tile).enhance(1.08)
    tile = ImageEnhance.Brightness(tile).enhance(1.08)

    overlay = Image.new("RGBA", tile.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    radius = 10
    box = (1, 1, TILE_W - 2, TILE_H - 2)
    draw.rounded_rectangle(box, radius=radius, fill=(255, 255, 255, 12), outline=(255, 244, 222, 190), width=2)
    draw.rounded_rectangle((4, 4, TILE_W - 5, TILE_H - 5), radius=radius - 3, outline=(255, 255, 255, 44), width=1)
    tile = Image.alpha_composite(tile, overlay)
    return tile


def draw_number(tile: Image.Image, number: int) -> Image.Image:
    tile = draw_framed_button(tile)
    overlay = Image.new("RGBA", tile.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    text = str(number)
    bbox = draw.textbbox((0, 0), text, font=NUMBER_FONT)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (TILE_W - text_w) / 2 - bbox[0]
    y = (TILE_H - text_h) / 2 - bbox[1] - 1
    draw.text((x + 1, y + 2), text, font=NUMBER_FONT, fill=(0, 0, 0, 132))
    draw.text((x, y), text, font=NUMBER_FONT, fill=(255, 247, 228, 244))
    tile = Image.alpha_composite(tile, overlay)
    return tile.convert("RGB")


def draw_blank(tile: Image.Image) -> Image.Image:
    return draw_framed_button(tile).convert("RGB")


def month_cells(month: int) -> list[list[int]]:
    cal = calendar.Calendar(firstweekday=6)
    rows = cal.monthdayscalendar(REFERENCE_YEAR, month)
    while len(rows) < 6:
        rows.append([0] * 7)
    return rows[:6]


def generate_month(month: int, panel_file: str) -> None:
    raw_panel = Image.open(PANEL_DIR / panel_file).convert("RGB")
    panel = clean_panel(raw_panel)
    PANEL_CLEAN_DIR.mkdir(parents=True, exist_ok=True)
    panel.save(PANEL_CLEAN_DIR / panel_file, quality=95, optimize=True)

    month_out = OUT_DIR / f"{month:02d}"
    month_out.mkdir(parents=True, exist_ok=True)

    cells = month_cells(month)
    first_blank: tuple[int, int] | None = None
    generated_days: set[int] = set()
    for row_index, row in enumerate(cells):
        for col_index, day in enumerate(row):
            if day == 0:
                first_blank = first_blank or (row_index, col_index)
                continue
            tile = crop_tile(panel, col_index, row_index)
            if (month, day) in SPECIAL_SOURCE_CENTERS:
                source_x, source_y = SPECIAL_SOURCE_CENTERS[(month, day)]
                tile = draw_framed_button(crop_tile_at(raw_panel, source_x, source_y)).convert("RGB")
            else:
                tile = draw_number(tile, day)
            tile.save(month_out / f"{day:02d}.jpg", quality=94, optimize=True)
            generated_days.add(day)

    if first_blank is None:
        first_blank = (5, 6)
    blank_row, blank_col = first_blank
    blank_tile = draw_blank(crop_tile(panel, blank_col, blank_row))
    blank_tile.save(month_out / "blank.jpg", quality=94, optimize=True)

    for day in range(1, MAX_DAYS[month] + 1):
        if day in generated_days:
            continue
        fallback_tile = draw_number(crop_tile(panel, blank_col, blank_row), day)
        fallback_tile.save(month_out / f"{day:02d}.jpg", quality=94, optimize=True)


def main() -> None:
    for month, panel_file in MONTH_PANEL_FILES.items():
        generate_month(month, panel_file)


if __name__ == "__main__":
    main()
