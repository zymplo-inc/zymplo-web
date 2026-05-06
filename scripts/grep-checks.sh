#!/usr/bin/env bash
# Pre-commit + CI grep checks · enforce R42 · R93 · R102 · R100
# Usage: bash scripts/grep-checks.sh [r42|r93|r102|r100|all]

set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="$ROOT_DIR/src"
EXIT_CODE=0

check_r42() {
  echo "→ R42 IDENTIDAD · forbidden tech jargon + audience labels"
  local pattern='cuentapropist|microempresari|MEIs |empreendedor[a]?|empreendedoras|small[ -]business[ -]owner|solopreneur|self-employed|monotributist|gestão empresarial|plataforma de gestão|software de gestão| SaaS | ERP | CRM | dashboard | KPI '
  if grep -rEnI --include='*.astro' --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' --include='*.md' --include='*.mdx' --include='*.json' "$pattern" "$SRC_DIR" 2>/dev/null; then
    echo "✗ R42 violation · forbidden phrases found"
    return 1
  else
    echo "✓ R42 clean"
  fi
}

check_r93() {
  echo "→ R93 REQUIRED PHRASES · forbidden setup time + decoration"
  local pattern='Setup en 3 min|Setup in 3 min|Setup em 3 min|floating[- ]?sphere|GradientMesh|country[- ]?flag[- ]?pill|globos flotantes'
  if grep -rEnI --include='*.astro' --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' --include='*.md' --include='*.mdx' --include='*.css' "$pattern" "$SRC_DIR" 2>/dev/null; then
    echo "✗ R93 violation · forbidden patterns found"
    return 1
  else
    echo "✓ R93 clean"
  fi
}

check_r102() {
  echo "→ R102 SUPREMA · no CONTIQ · no Hugo Costa · no Plan B R\$149"
  local pattern='CONTIQ|R\$ ?149|Hugo Costa|200\+ contador|200\+ contadores'
  if grep -rEnI --include='*.astro' --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' --include='*.md' --include='*.mdx' --include='*.json' "$pattern" "$SRC_DIR" 2>/dev/null; then
    echo "✗ R102 violation · CONTIQ-related content found"
    return 1
  else
    echo "✓ R102 clean"
  fi
}

check_r100() {
  echo "→ R100 ZERO-FAIL · forbidden HTTP headers in config"
  local config_files=("$ROOT_DIR/public/_headers" "$ROOT_DIR/vercel.json" "$ROOT_DIR/astro.config.mjs")
  local pattern='Clear-Site-Data|Pragma:[[:space:]]*no-cache|Cache-Control:[[:space:]]*no-store'
  for f in "${config_files[@]}"; do
    if [ -f "$f" ]; then
      if grep -EnI "$pattern" "$f" 2>/dev/null; then
        echo "✗ R100 violation in $f"
        return 1
      fi
    fi
  done
  echo "✓ R100 clean"
}

case "${1:-all}" in
  r42) check_r42 || EXIT_CODE=1 ;;
  r93) check_r93 || EXIT_CODE=1 ;;
  r102) check_r102 || EXIT_CODE=1 ;;
  r100) check_r100 || EXIT_CODE=1 ;;
  all)
    check_r42 || EXIT_CODE=1
    check_r93 || EXIT_CODE=1
    check_r102 || EXIT_CODE=1
    check_r100 || EXIT_CODE=1
    ;;
  *)
    echo "Usage: $0 [r42|r93|r102|r100|all]"
    exit 2
    ;;
esac

exit $EXIT_CODE
