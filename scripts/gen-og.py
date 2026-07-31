#!/usr/bin/env python3
"""Genera las 14 imágenes de vista previa (Open Graph) del sitio.

POR QUÉ EXISTEN

`og:image` apuntaba a `sims.zymplo.com/web/og/{país}.png`, que está detrás de
Cloudflare Access y devuelve 302 al login para cualquier crawler. Resultado
medido 2026-07-31 20:48Z: los 14 países daban 302, o sea que compartir CUALQUIER
página de Zymplo en WhatsApp no mostraba ninguna imagen.

Las 30 originales no están en el repo ni en `brand-assets/` — se buscaron. Esto
las reemplaza con una tarjeta limpia hecha con los assets canónicos:

  · fondo  #14B8A6  turquesa primario DEC-02
  · logo   `zymplo-logo-horizontal-blanco.svg`  (el SVG real, no un texto)
  · tipo   Manrope SemiBold  (la fuente de marca)

No pretende ser mejor que un diseño por país hecho a mano: pretende que exista
una vista previa donde hoy no hay ninguna. Si aparecen las originales, se
reemplazan los .png y no hay que tocar código.
"""
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
TEAL = (20, 184, 166)          # #14B8A6 · primario DEC-02
BLANCO = (255, 255, 255)

RAIZ = Path('/Users/cr/Zymplo-HQ')
LOGO_SVG = RAIZ / 'brand-assets/logos/svg/zymplo-logo-horizontal-blanco.svg'
FUENTE = RAIZ / 'repos/zymplo/zymplo-mobile/node_modules/@expo-google-fonts/manrope/600SemiBold/Manrope_600SemiBold.ttf'

SALIDA = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent.parent / 'public/brand/og'


def logo_png(ancho: int) -> Image.Image:
    """Rasteriza el SVG real de marca. Nunca se dibuja el logo con texto (R51)."""
    tmp = Path('/tmp/_og_logo.png')
    subprocess.run(
        ['rsvg-convert', '-w', str(ancho), '-o', str(tmp), str(LOGO_SVG)],
        check=True, capture_output=True)
    return Image.open(tmp).convert('RGBA')


def tarjeta(nombre_pais: str) -> Image.Image:
    img = Image.new('RGB', (W, H), TEAL)
    logo = logo_png(560)
    # Bloque logo+texto centrado como conjunto, no cada uno por su lado.
    alto_txt = 46
    hueco = 34
    alto_total = logo.height + hueco + alto_txt
    y = (H - alto_total) // 2
    img.paste(logo, ((W - logo.width) // 2, y), logo)

    d = ImageDraw.Draw(img)
    f = ImageFont.truetype(str(FUENTE), 40)
    caja = d.textbbox((0, 0), nombre_pais, font=f)
    d.text(((W - (caja[2] - caja[0])) // 2, y + logo.height + hueco),
           nombre_pais, font=f, fill=BLANCO)
    return img


def main():
    if not LOGO_SVG.exists():
        sys.exit(f'no está el logo: {LOGO_SVG}')
    if not FUENTE.exists():
        sys.exit(f'no está la fuente: {FUENTE}')
    SALIDA.mkdir(parents=True, exist_ok=True)

    paises = [l.split('|') for l in Path('/tmp/paises.txt').read_text().strip().split('\n')]
    for slug, nombre in paises:
        p = SALIDA / f'{slug}.png'
        tarjeta(nombre).save(p, 'PNG', optimize=True)
        print(f'  {p}  {p.stat().st_size // 1024} KB')

    # Fallback para la home global (`src/pages/index.astro`) y para cualquier
    # país nuevo que todavía no tenga su .png.
    p = SALIDA / 'zymplo.png'
    tarjeta('WhatsApp que trabaja para vos').save(p, 'PNG', optimize=True)
    print(f'  {p}  {p.stat().st_size // 1024} KB  (global)')
    print(f'total: {len(paises) + 1} imágenes')


if __name__ == '__main__':
    main()
