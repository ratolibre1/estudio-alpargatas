#!/usr/bin/env bash
# Importa recortes manuales (part-6 … part-30) → public/assets/comp-icons/*.webp
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${1:-$ROOT/scripts/source/comp-icons-selected}"
DEST="$ROOT/public/assets/comp-icons"
ARCHIVE="$ROOT/scripts/source/comp-icons-selected"

names=(
  rulebook deck-cards hand-cards die-d6 dice-poly
  tokens-stack tiles-stack meeples pawn miniature
  map player-board hex-tiles terrain-tiles puzzle
  coins resource-cubes cylinders heart-star flags
  hourglass token-bag player-screen spinner score-pad
)

if [[ ! -d "$SRC" ]]; then
  echo "No existe carpeta de recortes: $SRC" >&2
  exit 1
fi

mkdir -p "$DEST"
for i in "${!names[@]}"; do
  part=$((i + 6))
  slug="${names[$i]}"
  found=""
  for f in "$SRC"/*-part-"${part}".webp "$SRC"/part-"${part}".webp; do
    [[ -f "$f" ]] && found="$f" && break
  done
  if [[ -z "$found" ]]; then
    echo "Falta part-${part} (${slug}) en $SRC" >&2
    exit 1
  fi
  magick "$found" \
    -background none \
    -resize '200x200>' \
    -gravity center \
    -extent 216x216 \
    -define webp:method=6 \
    -define webp:alpha-compression=1 \
    -quality 92 \
    "$DEST/${slug}.webp"
done

echo "OK: ${#names[@]} iconos importados → $DEST (desde $SRC)"
