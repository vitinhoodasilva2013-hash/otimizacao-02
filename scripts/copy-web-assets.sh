#!/usr/bin/env sh
set -eu
ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
mkdir -p "$ROOT/android/app/src/main/assets"
rm -f "$ROOT/android/app/src/main/assets/"*
cp -R "$ROOT/frontend/dist/." "$ROOT/android/app/src/main/assets/"
echo "Arquivos web copiados para os assets Android."
