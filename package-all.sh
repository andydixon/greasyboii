#!/bin/bash
echo "📦 Packaging GreasyBoii v1.0.4..."
mkdir -p dist

echo "Chrome..."
cd chrome && zip -r ../dist/greasyboii-chrome-v1.0.4.zip * -x "*.DS_Store" && cd ..

echo "Firefox..."
cd firefox && zip -r ../dist/greasyboii-firefox-v1.0.4.zip * -x "*.DS_Store" && cd ..

echo ""
echo "✅ Done! Packages created:"
ls -lh dist/
