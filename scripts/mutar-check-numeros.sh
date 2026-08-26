#!/usr/bin/env bash
# ARNÉS DE MUTACIÓN · ¿el candado de números PUEDE ponerse rojo?
# ═══════════════════════════════════════════════════════════════════════════
#
# Un candado que nunca falla no está vigilando: está apagado. Este arnés le
# rompe la web a propósito, de nueve maneras distintas, y exige que el candado
# se dé cuenta de cada una. Si alguna mutación pasa en verde, el candado tiene
# un agujero de ese tamaño exacto.
#
# TRABAJA SOBRE UNA COPIA. No toca el árbol real ni un byte. La versión
# anterior de este tipo de arnés (vigías, 25-ago) mutaba el archivo de verdad
# y un Ctrl-C en el momento equivocado dejaba producción rota.
#
# Se lee por CÓDIGO DE SALIDA, nunca por el texto:
#   0 → los nueve controles pasaron
#   1 → algún control falló (el candado tiene un agujero)
#   2 → no se pudo correr el arnés
set -uo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BANCO="$(mktemp -d "${TMPDIR:-/tmp}/candado-numeros.XXXXXX")"
trap 'rm -rf "$BANCO"' EXIT INT TERM

ok=0; mal=0

# Corre el candado sobre el banco y devuelve SOLO el código de salida.
estado() {
  ( cd "$REPO" && env "$@" npx tsx "$BANCO/scripts/check-numeros-wa.ts" >/dev/null 2>&1 )
  echo $?
}

# Rehace el banco limpio desde el árbol real.
sembrar() {
  rm -rf "$BANCO"; mkdir -p "$BANCO"
  cp -R "$REPO/src" "$REPO/public" "$REPO/scripts" "$BANCO/" 2>/dev/null
  cp "$REPO/tsconfig.json" "$REPO/package.json" "$BANCO/" 2>/dev/null
}

# control <nombre> <esperado> [VAR=val ...]
control() {
  local nombre="$1" esperado="$2"; shift 2
  local dio; dio="$(estado "$@")"
  if [ "$dio" = "$esperado" ]; then
    printf '  ✓ %-46s exit=%s\n' "$nombre" "$dio"; ok=$((ok+1))
  else
    printf '  ✗ %-46s exit=%s · esperaba %s\n' "$nombre" "$dio" "$esperado"; mal=$((mal+1))
  fi
}

PUERTA="$BANCO/src/data/countries.ts"
VICTIMA="$BANCO/src/pages/app/dashboard.astro"

echo "ARNÉS DEL CANDADO DE NÚMEROS · banco: $BANCO"
echo

# ── 0 · el arnés puede correr ───────────────────────────────────────────────
sembrar
[ -f "$PUERTA" ] || { echo "MEDICION-INVALIDA · no pude sembrar el banco"; exit 2; }
[ -f "$VICTIMA" ] || { echo "MEDICION-INVALIDA · falta la página víctima"; exit 2; }

# ── 1 · CONTROL POSITIVO ────────────────────────────────────────────────────
# Sin esto no se puede leer ningún rojo: si el banco limpio ya sale rojo, todas
# las mutaciones «funcionan» por el motivo equivocado.
control "positivo · banco limpio da VERDE" 0

# ── 2 · IDEMPOTENCIA ────────────────────────────────────────────────────────
# Dos corridas seguidas, mismo resultado. Un candado que depende del orden o
# deja estado atrás miente la segunda vez.
a="$(estado)"; b="$(estado)"
if [ "$a" = "$b" ] && [ "$a" = "0" ]; then
  printf '  ✓ %-46s exit=%s,%s\n' "idempotente · dos corridas iguales" "$a" "$b"; ok=$((ok+1))
else
  printf '  ✗ %-46s exit=%s,%s · esperaba 0,0\n' "idempotente · dos corridas iguales" "$a" "$b"; mal=$((mal+1))
fi

# ── 3 · REVERSO: teléfono personal, pelado ──────────────────────────────────
sembrar
printf '\n<!-- contacto: 595981970735 -->\n' >> "$VICTIMA"
control "rojo · teléfono personal pelado" 1

# ── 4 · REVERSO: el mismo, con espacios ─────────────────────────────────────
# La forma exacta en que estaba escondido en countries.ts hasta hoy, y la que
# un grep del número pelado NO encuentra.
sembrar
printf '\n<!-- contacto: +595 981 970 735 -->\n' >> "$VICTIMA"
control "rojo · teléfono personal con espacios" 1

# ── 5 · REVERSO: número de prueba de Meta ───────────────────────────────────
sembrar
printf '\n<a href="https://wa.me/15556447935">probar</a>\n' >> "$VICTIMA"
control "rojo · número de prueba de Meta" 1

# ── 6 · REVERSO: número VIVO elegido a mano ─────────────────────────────────
# El número es correcto; lo que está mal es que la página lo elija sola. Este
# control prueba la regla de la puerta única por separado de la de prohibidos:
# si sólo funcionara la lista negra, esta mutación pasaría en verde.
sembrar
printf '\n<a href="https://wa.me/12027718788">hola</a>\n' >> "$VICTIMA"
control "rojo · número vivo pero elegido a mano" 1

# ── 7 · REVERSO: waNumberFor manda Brasil al global ─────────────────────────
# La falla del mundo real: el brasileño termina en el WhatsApp de USA. El
# archivo sigue nombrando todo bien; sólo cambia el COMPORTAMIENTO.
sembrar
perl -pi -e "s/slug === 'br' \? WA_NUMBER_BR : WA_NUMBER/slug === 'br' ? WA_NUMBER : WA_NUMBER/" "$PUERTA"
control "rojo · Brasil ruteado al número global" 1

# ── 8 · REVERSO: cambia el número vivo ──────────────────────────────────────
sembrar
perl -pi -e "s/WA_NUMBER_BR = '5511925697328'/WA_NUMBER_BR = '5511900000000'/" "$PUERTA"
control "rojo · número de Brasil cambiado" 1

# ── 9 · MEDICION-INVALIDA no se degrada a ROJO ──────────────────────────────
# «No pude medir» y «medí y está mal» son cosas distintas. Si esto devuelve 1,
# un día vamos a creer que el candado revisó cuando no pudo abrir el archivo.
sembrar
rm -f "$PUERTA"
control "exit 2 · sin la puerta, NO se degrada a 1" 2

# ── 10 · el interruptor apaga de verdad ─────────────────────────────────────
sembrar
printf '\n<!-- contacto: 595981970735 -->\n' >> "$VICTIMA"
control "interruptor apaga (con la web rota)" 0 SALTAR_CANDADO_NUMEROS=si-y-me-hago-cargo

# ── 11 · pero NO se apaga con cualquier cosa ────────────────────────────────
# Un interruptor que se activa con "1" o "true" se aprieta sin querer.
control "interruptor NO cede a un valor casual" 1 SALTAR_CANDADO_NUMEROS=1

echo
if [ "$mal" -gt 0 ]; then
  echo "ROJO · $mal de $((ok+mal)) controles fallaron · el candado tiene agujeros"
  exit 1
fi
echo "VERDE · $ok/$ok controles · el candado se pone rojo cuando tiene que ponerse"
exit 0
