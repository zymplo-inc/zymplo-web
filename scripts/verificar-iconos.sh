#!/bin/bash
# Los íconos de la web tienen que ser CUADRADOS y el isotipo tiene que leerse.
#
# 2026-07-31: `public/brand/apple-touch-icon.png` medía 180×150 mientras el HTML
# lo declaraba `sizes="180x180"`. El iPhone lo estiraba para que entrara y el
# logo salía deformado en la pantalla de inicio. Nadie lo vio nunca porque en la
# computadora el archivo se abre bien: el defecto sólo aparece en el teléfono.
set -e
cd "$(dirname "$0")/.."
fallas=0

for f in public/brand/apple-touch-icon.png; do
  read -r w h < <(python3 -c "
import struct,sys
b=open('$f','rb').read()
print(struct.unpack('>I',b[16:20])[0], struct.unpack('>I',b[20:24])[0])")
  if [ "$w" != "$h" ]; then
    echo "❌ $f mide ${w}×${h} — el HTML lo declara cuadrado, el iPhone lo va a estirar"
    fallas=$((fallas+1))
  else
    echo "✅ $f es cuadrado (${w}×${h})"
  fi
done

# Ocupación del isotipo (macOS: usa sips · en CI hace falta el shim a ImageMagick)
if command -v sips >/dev/null 2>&1; then
  python3 scripts/medir-logo-lienzo-chico.py --gate public/brand/apple-touch-icon.png || fallas=$((fallas+1))
else
  echo "⏭  medición de ocupación salteada (sin sips)"
fi

exit $fallas
