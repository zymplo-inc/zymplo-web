#!/usr/bin/env python3
"""Mide si un logo se va a LEER en el tamaño en que la gente lo ve.

Nace del 2026-07-31: el logo de la pantalla de consentimiento de Google se veía
minúsculo. La causa no era el logo — era que el isotipo ocupaba el 20% del
lienzo y Google lo renderiza a 32 px, así que al usuario le llegaban 6 píxeles.
A 1024 px, en la pantalla de quien lo diseñó, se veía perfecto.

Este script cuenta PÍXELES CON TINTA sobre el PNG renderizado. No lee el SVG, no
confía en la geometría declarada: la primera corrección salió descentrada 103 px
en vertical y la matemática decía que estaba bien.

    python3 medir-logo-lienzo-chico.py logo.png [más.png ...]
    python3 medir-logo-lienzo-chico.py --gate logo.png   # sale 1 si no cumple

Regla (ver ~/.claude/CLAUDE.md · "REGLA DEL LOGO EN LIENZO CHICO"):
  · isotipo solo, sin wordmark
  · ~72% del lado mayor  (se acepta 60-85%)
  · centrado óptico: desbalance <= 2 px por eje
"""
import os
import struct
import subprocess
import sys
import tempfile

OBJETIVO = 72.0
MIN_OCUPACION = 60.0
MAX_OCUPACION = 85.0
MAX_DESBALANCE = 2

# Un ícono "maskable" (PWA/Android) NO se juzga con la misma vara: el sistema le
# recorta un círculo del 80% del lienzo, así que un 72% se come el dibujo por los
# bordes. La zona segura real deja el contenido en ~55%. Sin este modo, el gate
# obligaría a romper justamente el asset que viene a proteger.
MIN_MASKABLE = 45.0
MAX_MASKABLE = 62.0


def bbox(png: str):
    """Bounding box de la tinta. Devuelve (w, h, x0, y0, x1, y1).

    🔴 El fondo se DETECTA, no se asume blanco. La primera versión buscaba
    "píxeles no blancos" y devolvía 100% de ocupación para todo asset con fondo
    de color — `icon.png`, `splash-icon.png` y el ícono de Android tienen fondo
    turquesa a sangre, así que el fondo entero contaba como tinta y el gate los
    daba por buenos midiendo exactamente nada. Se detectó al cruzar este
    resultado contra otra medición que sí los distinguía.

    Ahora el fondo es el color de las 4 esquinas (moda) y la tinta es todo lo
    que se aleja de él más que `TOL` en distancia Manhattan RGB.
    """
    tmp = tempfile.mktemp(suffix=".bmp")
    r = subprocess.run(["sips", "-s", "format", "bmp", png, "--out", tmp],
                       capture_output=True)
    if r.returncode != 0 or not os.path.exists(tmp):
        raise RuntimeError(f"sips no pudo convertir {png}")
    d = open(tmp, "rb").read()
    os.unlink(tmp)

    off = struct.unpack_from("<I", d, 10)[0]
    w = struct.unpack_from("<i", d, 18)[0]
    h_raw = struct.unpack_from("<i", d, 22)[0]
    bpp = struct.unpack_from("<H", d, 28)[0]

    # 🔴 height NEGATIVO = filas de arriba hacia abajo. Ignorarlo da porcentajes
    # negativos — si el número sale absurdo, el parser está mal, no el asset.
    topdown = h_raw < 0
    h = abs(h_raw)
    B = bpp // 8
    stride = (w * B + 3) // 4 * 4

    def px(x, ry):
        p = off + ry * stride + x * B
        return d[p + 2], d[p + 1], d[p]          # BMP guarda BGR

    # Fondo = color MÁS FRECUENTE de una grilla de muestreo.
    #
    # Segundo intento del detector. El primero miraba las 4 esquinas y también
    # falló: `icon.png` tiene las esquinas REDONDEADAS y transparentes, que sips
    # aplasta a negro, así que las 4 esquinas daban (0,0,0) y el turquesa real
    # —que empieza a ~100 px del borde— quedaba contado como tinta. Volvía a dar
    # 100%. El color dominante resuelve los tres casos: fondo blanco, fondo
    # turquesa a sangre, y fondo turquesa con esquinas redondeadas.
    from collections import Counter
    paso = max(1, min(w, h) // 64)
    muestras = Counter(px(x, ry) for ry in range(0, h, paso) for x in range(0, w, paso))
    fondo = muestras.most_common(1)[0][0]
    TOL = 60                                      # distancia Manhattan RGB

    # `sips` aplasta el canal alfa a NEGRO PURO. Un ícono con esquinas
    # redondeadas (icon.png) queda con (0,0,0) en las cuatro puntas, y esas
    # puntas estiraban el bounding box hasta los bordes → 100% otra vez, ahora
    # con el fondo bien detectado. Se ignora el negro puro cuando el fondo no es
    # negro: ninguna marca de Zymplo usa negro puro (paleta #14B8A6 / blanco).
    ignorar_negro = fondo != (0, 0, 0)

    # DOS MODOS, porque la pregunta no es la misma en los dos tipos de asset:
    #
    #  A · fondo NEUTRO (blanco/negro) → el glifo es todo lo que difiere del
    #      fondo. Sirve para el consent screen, el favicon sobre blanco, etc.
    #
    #  B · fondo DE MARCA (turquesa a sangre, como icon.png o el ícono de
    #      Android) → el glifo es el BLANCO encima del turquesa. Medir "lo
    #      distinto del dominante" ahí devuelve 99% porque cuenta el borde
    #      redondeado y el antialiasing del propio fondo: técnicamente cierto,
    #      inútil. Lo que hay que medir es el dibujo blanco.
    claro = lambda c: c[0] > 200 and c[1] > 200 and c[2] > 200  # noqa: E731
    oscuro = lambda c: c[0] < 60 and c[1] < 60 and c[2] < 60    # noqa: E731
    modo_b = not claro(fondo) and not oscuro(fondo)

    mnx, mny, mxx, mxy = w, h, -1, -1
    for ry in range(h):
        y = ry if topdown else h - 1 - ry
        for x in range(w):
            r_, g_, b_ = px(x, ry)
            if ignorar_negro and r_ == 0 and g_ == 0 and b_ == 0:
                continue
            if modo_b:
                if not claro((r_, g_, b_)):
                    continue
            elif abs(r_ - fondo[0]) + abs(g_ - fondo[1]) + abs(b_ - fondo[2]) <= TOL:
                continue
            if True:
                if x < mnx: mnx = x
                if x > mxx: mxx = x
                if y < mny: mny = y
                if y > mxy: mxy = y
    if mxx < 0:
        raise RuntimeError(f"{png}: todo el lienzo es del color de fondo {fondo} "
                           f"— no hay marca que medir")
    return w, h, mnx, mny, mxx, mxy, fondo


def medir(png: str) -> dict:
    w, h, x0, y0, x1, y1, fondo = bbox(png)
    bw, bh = x1 - x0 + 1, y1 - y0 + 1
    return {
        "archivo": png,
        "lienzo": (w, h),
        "tinta": (bw, bh),
        "pct_ancho": bw / w * 100,
        "pct_alto": bh / h * 100,
        "margenes": (x0, w - 1 - x1, y0, h - 1 - y1),
        "desbal_h": abs(x0 - (w - 1 - x1)),
        "desbal_v": abs(y0 - (h - 1 - y1)),
        "a_32px": bh / h * 32,
        "fondo": fondo,
        "modo": "glifo claro sobre fondo de marca" if not (fondo[0]>200 and fondo[1]>200 and fondo[2]>200) and not (fondo[0]<60 and fondo[1]<60 and fondo[2]<60) else "tinta sobre fondo neutro",
    }


def cumple(m: dict) -> tuple[bool, list[str]]:
    fallas = []
    mayor = max(m["pct_ancho"], m["pct_alto"])
    mask = "maskable" in os.path.basename(m["archivo"]).lower()
    lo, hi = (MIN_MASKABLE, MAX_MASKABLE) if mask else (MIN_OCUPACION, MAX_OCUPACION)
    if mayor < lo:
        fallas.append(f"ocupa {mayor:.1f}% del lado mayor · mínimo {lo}% "
                      f"(a 32 px se ve a {m['a_32px']:.1f} px)")
    if mayor > hi:
        fallas.append(f"ocupa {mayor:.1f}% · máximo {hi}%"
                      + (" · el recorte circular se lo come" if mask else ", queda sin aire"))
    if m["desbal_h"] > MAX_DESBALANCE:
        fallas.append(f"descentrado {m['desbal_h']} px en horizontal")
    if m["desbal_v"] > MAX_DESBALANCE:
        fallas.append(f"descentrado {m['desbal_v']} px en vertical")
    return (not fallas), fallas


def main() -> int:
    args = [a for a in sys.argv[1:] if a != "--gate"]
    gate = "--gate" in sys.argv
    if not args:
        print(__doc__)
        return 2

    malos = 0
    for png in args:
        try:
            m = medir(png)
        except Exception as e:  # noqa: BLE001 — queremos el motivo en pantalla
            print(f"✗ {png}: {e}")
            malos += 1
            continue
        ok, fallas = cumple(m)
        izq, der, arr, aba = m["margenes"]
        print(f"{'✅' if ok else '❌'} {os.path.basename(png)}")
        print(f"   fondo rgb{m['fondo']} · modo: {m['modo']}")
        print(f"   lienzo {m['lienzo'][0]}×{m['lienzo'][1]} · tinta {m['tinta'][0]}×{m['tinta'][1]}"
              f" · {m['pct_ancho']:.1f}% ancho · {m['pct_alto']:.1f}% alto")
        print(f"   márgenes izq {izq} der {der} arr {arr} aba {aba}"
              f" · desbalance {m['desbal_h']}/{m['desbal_v']} px")
        print(f"   a 32 px reales el dibujo mide {m['a_32px']:.1f} px de alto")
        for f in fallas:
            print(f"   → {f}")
            malos += 1
    return 1 if (gate and malos) else 0


if __name__ == "__main__":
    sys.exit(main())
