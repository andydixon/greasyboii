#!/bin/bash
# Packages both extensions into dist/. Each browser has its own release script that
# reads its version straight out of its manifest.json — nothing is hardcoded here.
set -euo pipefail
cd "$(dirname "$0")"

./package-chrome-release.sh
./package-firefox-release.sh

echo ""
echo "✅ Done! Packages created:"
ls -lh dist/
