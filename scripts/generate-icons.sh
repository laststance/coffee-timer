#!/bin/bash
# Icon Generation Script for Coffee Timer PWA
# Requires: ImageMagick (brew install imagemagick on macOS)

set -e

echo "🎨 Generating PWA icons for Coffee Timer..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Please install it:"
    echo "   macOS: brew install imagemagick"
    echo "   Ubuntu: sudo apt-get install imagemagick"
    echo "   Or use online converter: https://cloudconvert.com/svg-to-png"
    exit 1
fi

cd "$(dirname "$0")/.."

# Create output directory
mkdir -p public/icons-temp

# Generate standard icons from icon.svg
echo "📱 Generating standard icons..."
convert -background none public/icon.svg -resize 192x192 public/icon-192x192.png
convert -background none public/icon.svg -resize 512x512 public/icon-512x512.png
convert -background none public/icon.svg -resize 180x180 public/apple-touch-icon.png

# Generate maskable icon
echo "🎭 Generating maskable icon..."
convert -background none public/icon-maskable.svg -resize 192x192 public/icon-192x192-maskable.png

# Generate favicon (multi-size ICO)
echo "🔖 Generating favicon.ico..."
convert -background none public/icon.svg -resize 16x16 public/icons-temp/favicon-16.png
convert -background none public/icon.svg -resize 32x32 public/icons-temp/favicon-32.png
convert -background none public/icon.svg -resize 48x48 public/icons-temp/favicon-48.png
convert public/icons-temp/favicon-16.png public/icons-temp/favicon-32.png public/icons-temp/favicon-48.png public/favicon.ico

# Generate notification badge (monochrome)
echo "🔔 Generating notification badge..."
convert -background none public/icon.svg -resize 96x96 -colorspace Gray public/badge.png

# Cleanup
rm -rf public/icons-temp

echo "✅ Icon generation complete!"
echo ""
echo "Generated files:"
echo "  - icon-192x192.png (192x192)"
echo "  - icon-512x512.png (512x512)"
echo "  - icon-192x192-maskable.png (192x192 with safe zone)"
echo "  - apple-touch-icon.png (180x180)"
echo "  - favicon.ico (16x16, 32x32, 48x48)"
echo "  - badge.png (96x96 monochrome)"
echo ""
echo "Next steps:"
echo "  1. Verify icons look correct"
echo "  2. Run 'pnpm build' to test"
echo "  3. Test PWA installation on mobile"
