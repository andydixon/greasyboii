#!/bin/bash
# Builds a store-ready GreasyBoii Chrome package: dist/greasyboii-chrome-v<version>.zip,
# with manifest.json at the zip root — ready to upload to the Chrome Web Store dashboard.
set -euo pipefail
cd "$(dirname "$0")"

VERSION=$(python3 -c "import json; print(json.load(open('chrome/manifest.json'))['version'])")

REQUIRED_FILES=(
  manifest.json background.js content.js
  popup.html popup.css popup.js
  bootstrap.min.css bootstrap.bundle.min.js
  icon16.png icon48.png icon128.png
)

echo "Checking required files..."
for f in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "chrome/$f" ]; then
    echo "Missing chrome/$f" >&2
    exit 1
  fi
done

mkdir -p dist
OUT="dist/greasyboii-chrome-v${VERSION}.zip"
rm -f "$OUT"

echo "Packaging GreasyBoii Chrome v${VERSION}..."
(cd chrome && zip -rq "../$OUT" . -x "*.DS_Store" -x "icon.svg")

echo "Done: $OUT"
unzip -l "$OUT"
