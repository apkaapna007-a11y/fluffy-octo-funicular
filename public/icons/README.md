# App Icons

To generate the required PNG icons from the SVG, run these commands:

## Using ImageMagick (if available):

```bash
# Install ImageMagick first: sudo apt-get install imagemagick

# Generate all required sizes
convert -background none -size 72x72 ../icon.svg icon-72x72.png
convert -background none -size 96x96 ../icon.svg icon-96x96.png
convert -background none -size 128x128 ../icon.svg icon-128x128.png
convert -background none -size 144x144 ../icon.svg icon-144x144.png
convert -background none -size 152x152 ../icon.svg icon-152x152.png
convert -background none -size 192x192 ../icon.svg icon-192x192.png
convert -background none -size 384x384 ../icon.svg icon-384x384.png
convert -background none -size 512x512 ../icon.svg icon-512x512.png
```

## Using Online Tools:

1. Visit https://realfavicongenerator.net/
2. Upload the `icon.svg` file
3. Download the generated icon pack
4. Extract and place the PNG files in this directory

## Icon Sizes Required:

- icon-72x72.png (72×72px)
- icon-96x96.png (96×96px)
- icon-128x128.png (128×128px)
- icon-144x144.png (144×144px)
- icon-152x152.png (152×152px)
- icon-192x192.png (192×192px)
- icon-384x384.png (384×384px)
- icon-512x512.png (512×512px)

The icons will be used for:
- Home screen shortcuts
- App launcher
- Splash screens
- Browser tab favicon
- Various OS integrations