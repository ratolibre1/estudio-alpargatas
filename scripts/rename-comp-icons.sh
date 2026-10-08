#!/usr/bin/env bash
# Fallback: auto-slice de ICONOS.png. Preferir recortes manuales → ./import-comp-icons.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${1:-$ROOT/scripts/source/ICONOS.png}"
DIR="$ROOT/public/assets/comp-icons"
mkdir -p "$DIR"

python3 - "$SRC" "$DIR" <<'PY'
import subprocess
import sys
from pathlib import Path

src, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
names = [
    "rulebook", "deck-cards", "hand-cards", "die-d6", "dice-poly",
    "tokens-stack", "tiles-stack", "meeples", "pawn", "miniature",
    "map", "player-board", "hex-tiles", "terrain-tiles", "puzzle",
    "coins", "resource-cubes", "cylinders", "heart-star", "flags",
    "hourglass", "token-bag", "player-screen", "spinner", "score-pad",
]

def identify(path: Path) -> tuple[int, int]:
    r = subprocess.run(
        ["magick", "identify", "-format", "%w %h", str(path)],
        capture_output=True,
        text=True,
        check=True,
    )
    w, h = r.stdout.strip().split()
    return int(w), int(h)

def cell_rect(col: int, row: int, w: int, h: int, cols: int, rows: int, gutter: int):
    cell_w, cell_h = w / cols, h / rows
    x0 = round(col * cell_w)
    x1 = round((col + 1) * cell_w) if col < cols - 1 else w
    y0 = round(row * cell_h)
    y1 = round((row + 1) * cell_h) if row < rows - 1 else h
    return x0 + gutter, y0 + gutter, (x1 - x0) - 2 * gutter, (y1 - y0) - 2 * gutter

w, h = identify(src)
cols = rows = 5
gutter = 6  # solo anti-bleed; el sheet ya tiene aire entre iconos
pad_after_trim = 14
canvas = 216
max_icon = 188

for i, slug in enumerate(names):
    row, col = divmod(i, cols)
    x, y, cw, ch = cell_rect(col, row, w, h, cols, rows, gutter)
    tmp = out_dir / f"_slice-{slug}.png"
    dst = out_dir / f"{slug}.webp"
    crop = f"{cw}x{ch}+{x}+{y}"

    subprocess.run(["magick", str(src), "-crop", crop, "+repage", str(tmp)], check=True)
    subprocess.run(
        [
            "magick",
            str(tmp),
            "-alpha",
            "set",
            "-background",
            "none",
            "-fuzz",
            "16%",
            "-transparent",
            "white",
            "-trim",
            "+repage",
            "-bordercolor",
            "none",
            "-border",
            f"{pad_after_trim}x{pad_after_trim}",
            "-resize",
            f"{max_icon}x{max_icon}>",
            "-background",
            "none",
            "-gravity",
            "center",
            "-extent",
            f"{canvas}x{canvas}",
            "-define",
            "webp:method=6",
            "-define",
            "webp:alpha-compression=1",
            "-quality",
            "92",
            str(dst),
        ],
        check=True,
    )
    tmp.unlink(missing_ok=True)

print(
    f"OK: {len(names)} iconos → {out_dir} "
    f"({w}x{h}, gutter={gutter}px, canvas={canvas}px)"
)
PY
