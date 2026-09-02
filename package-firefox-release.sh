#!/bin/bash
# Builds a store-ready GreasyBoii Firefox package: dist/greasyboii-firefox-v<version>.zip,
# with manifest.json at the zip root — ready for AMO upload or `web-ext sign`.
set -euo pipefail
cd "$(dirname "$0")"

VERSION=$(python3 -c "import json; print(json.load(open('firefox/manifest.json'))['version'])")

REQUIRED_FILES=(
  manifest.json background.js content.js
  popup.html popup.css popup.js
  bootstrap.min.css bootstrap.bundle.min.js
  icon16.png icon48.png icon128.png
)

echo "Checking required files..."
for f in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "firefox/$f" ]; then
    echo "Missing firefox/$f" >&2
    exit 1
  fi
done

mkdir -p dist
OUT="dist/greasyboii-firefox-v${VERSION}.zip"
rm -f "$OUT"

echo "Packaging GreasyBoii Firefox v${VERSION}..."
(cd firefox && zip -rq "../$OUT" . -x "*.DS_Store" -x "icon.svg")

echo "Done: $OUT"
unzip -l "$OUT"
