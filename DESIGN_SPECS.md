# Coffee Timer - PWA Asset Design Specifications

## 🎯 Design Brief

**S-Tier Product Grade | Modern Minimalist | Coffee & Relaxation Theme**

Create a cohesive set of PWA assets that embody:

- **Warmth & Calm**: Relaxing coffee break atmosphere
- **Modern Minimalism**: Clean, simple, recognizable at any size
- **Premium Quality**: Apple Liquid Glass meets Material Design 3 aesthetic
- **Cross-Platform Excellence**: Perfect rendering on iOS, Android, Windows

---

## 🎨 Core Design System

### Color Palette

**Primary Colors:**

- **Warm Cream Background**: `#FEF3C7` (soft, inviting base)
- **Soft Amber Accent**: `#FBBF24` (warmth, energy)
- **Coffee Brown**: `#8B4513` (main icon color, earthy)
- **Deep Espresso**: `#3E2723` (text, strong contrast)

**Brand Accent (Limited Use):**

- **Fresh Green**: `#10B981` (timer active state, use sparingly)

**Gradient Recommendation:**

```css
/* Smooth atmospheric background gradient */
background: radial-gradient(circle at center, #fef3c7 0%, #fbbf24 100%);
/* or */
background: linear-gradient(135deg, #fef3c7 0%, #f59e0b 50%, #fbbf24 100%);
```

### Typography

- **Font Family**: Rounded sans-serif (Quicksand, Söhne Rounded, or similar)
- **Style**: Soft, friendly, modern
- **Weight**: Medium to Bold for wordmarks

### Visual Style

- **Iconography**: Single-line art, minimalist coffee cup with steam
- **Shapes**: Rounded, organic, no sharp edges
- **Depth**: Subtle shadows, smooth gradients (avoid flat)
- **Texture**: Optional: fine paper grain at 5% opacity

---

## 📐 Icon Design Specifications

### Master Icon (1024x1024px)

**Design Elements:**

1. **Central Icon**: Minimalist coffee cup silhouette
   - Single-line art style or simplified solid shape
   - Steam wisps rising from cup (3 curved lines)
   - Cup positioned at center

2. **Background**: Smooth radial gradient
   - Center: `#FEF3C7`
   - Edge: `#FBBF24`
   - Soft, atmospheric feel

3. **Proportions**:
   - Cup height: ~50% of canvas
   - Cup width: ~40% of canvas
   - Steam extends to ~70% canvas height
   - Centered both horizontally and vertically

**Export Requirements:**

- **Format**: PNG (24-bit with transparency) OR SVG for vector scaling
- **Resolution**: 1024x1024px minimum
- **Color Space**: sRGB
- **Compression**: Optimized PNG (use ImageOptim or similar)

---

### Maskable Icon Safe Zone Guidelines

**Critical for Android Adaptive Icons**

```
┌─────────────────────────────────┐
│  Full Canvas (512x512px)        │
│  ┌───────────────────────────┐  │
│  │  Decoration Zone (60%)    │  │
│  │  (Background, gradients)  │  │
│  │   ┌─────────────────┐     │  │
│  │   │  SAFE ZONE      │     │  │
│  │   │  (40% radius)   │     │  │
│  │   │  Critical Icon  │     │  │
│  │   │  Content Here   │     │  │
│  │   └─────────────────┘     │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**Safe Zone Dimensions:**

- **512px Icon**: Safe zone = 204.8px diameter circle (center)
- **192px Icon**: Safe zone = 76.8px diameter circle (center)

**Design Rules:**

1. ✅ **Inside Safe Zone**: Coffee cup icon, all critical visual elements
2. ✅ **Outside Safe Zone**: Background gradient, decorative elements
3. ❌ **Avoid**: Text, small details, or critical shapes outside safe zone

---

## 📦 Required Asset List

### 1. App Icons

| Filename                | Size    | Purpose           | Notes                                      |
| ----------------------- | ------- | ----------------- | ------------------------------------------ |
| `icon-144x144.png`      | 144×144 | Standard PWA icon | Full design                                |
| `icon-192x192.png`      | 192×192 | Standard PWA icon | Full design                                |
| `icon-512x512.png`      | 512×512 | Standard PWA icon | Full design, highest quality               |
| `icon-192x192-safe.png` | 192×192 | Maskable variant  | Icon within 40% safe zone                  |
| `apple-touch-icon.png`  | 180×180 | iOS home screen   | Square with rounded corners handled by iOS |

### 2. Favicon

| Filename      | Size       | Purpose          | Notes                        |
| ------------- | ---------- | ---------------- | ---------------------------- |
| `favicon.ico` | Multi-size | Browser tab icon | Contains 16×16, 32×32, 48×48 |

**Favicon Design:**

- Simplified version of main icon
- Higher contrast for small sizes
- Remove steam wisps, keep cup only
- Solid colors (no gradients at small sizes)

### 3. Badge Icon

| Filename    | Size  | Purpose            | Notes                 |
| ----------- | ----- | ------------------ | --------------------- |
| `badge.png` | 96×96 | Notification badge | Monochrome silhouette |

**Badge Design:**

- Pure white icon on transparent background
- Simplified coffee cup silhouette (no steam)
- High contrast, bold shapes
- Will be tinted by OS, so design as pure white

### 4. Shortcut Icons

| Filename                 | Size  | Purpose                | Design Variation     |
| ------------------------ | ----- | ---------------------- | -------------------- |
| `shortcuts/start.png`    | 96×96 | "Start Timer" shortcut | Cup with play symbol |
| `shortcuts/settings.png` | 96×96 | "Settings" shortcut    | Cup with gear symbol |

**Shortcut Design Guidelines:**

- Use same color palette as main icon
- Add small symbol overlay to differentiate:
  - **Start**: Play triangle (▶) in fresh green
  - **Settings**: Gear/cog icon in coffee brown

### 5. Screenshots

| Filename                        | Size     | Form Factor | Purpose                     |
| ------------------------------- | -------- | ----------- | --------------------------- |
| `screenshots/desktop-wide.png`  | 1280×720 | Wide        | App store listing (desktop) |
| `screenshots/mobile-narrow.png` | 375×812  | Narrow      | App store listing (mobile)  |

**Screenshot Guidelines:**

- Capture actual app UI after implementing new branding
- Show timer in interesting state (e.g., 3:45 countdown)
- Include new icon/branding elements visible in UI
- Clean, uncluttered composition
- Professional quality (use browser DevTools for pixel-perfect capture)

---

## 🛠 Asset Creation Methods

### Option 1: Professional Design Tools

**Figma (Recommended)**

1. Create 1024×1024 artboard
2. Use vector shapes for scalability
3. Apply gradients and effects
4. Export at multiple sizes simultaneously
5. Use Figma's "Export as…" with 1×, 2×, 3× for retina

**Adobe Illustrator / Affinity Designer**

1. Create vector artwork
2. Export as SVG for web
3. Rasterize at required sizes for PNG

**Sketch (macOS)**

1. Use symbols for reusable components
2. Export slices at exact dimensions

### Option 2: AI Generation Tools

**DALL-E 3 / Midjourney Prompt Template:**

```
A minimalist app icon for a coffee timer application, featuring a simple single-line
coffee cup with gentle steam wisps rising, centered on a smooth radial gradient
background from warm cream (#FEF3C7) to soft amber (#FBBF24). The coffee cup is
drawn in coffee brown (#8B4513) with rounded, organic shapes. Modern, clean,
premium aesthetic inspired by Apple Liquid Glass design. Flat design, no text,
perfectly centered, suitable for a mobile app icon. --ar 1:1 --style minimalist
```

**ChatGPT DALL-E Integration:**

1. Use prompt above
2. Request 1024×1024 resolution
3. Iterate on variations
4. Download and resize as needed

**Tips for AI Generation:**

- Request multiple variations
- Specify "no text" explicitly
- Ask for "perfectly centered composition"
- Mention "app icon design" for proper framing

### Option 3: Icon Generation Services

**PWA Asset Generator Tools:**

- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
- [Favicon.io](https://favicon.io/)

**Process:**

1. Upload your master 1024×1024 icon
2. Auto-generate all required sizes
3. Download complete asset pack
4. Verify maskable safe zones manually

---

## ✅ Quality Checklist

### Design Quality

- [ ] Icon recognizable at 16×16px (favicon size)
- [ ] Icon scales beautifully to 512×512px without pixelation
- [ ] Maskable variant has all critical elements within 40% safe zone
- [ ] Color palette consistent across all assets
- [ ] Gradient smooth, no banding artifacts
- [ ] Shapes have consistent rounded style

### Technical Quality

- [ ] All PNGs optimized (use ImageOptim, TinyPNG)
- [ ] Favicon.ico contains multiple sizes (16, 32, 48)
- [ ] Apple touch icon has no transparency (solid background)
- [ ] Badge icon is pure white on transparent
- [ ] Screenshots show actual app UI with new branding
- [ ] All files named exactly as specified

### Platform Testing

- [ ] Test maskable icon on Android simulator
- [ ] Verify iOS home screen appearance
- [ ] Check Windows Start menu tile
- [ ] Validate browser tab favicon visibility
- [ ] Test notification badge rendering

### Accessibility

- [ ] Color contrast ratio ≥ 4.5:1 for text elements
- [ ] Icon distinguishable in grayscale
- [ ] No reliance on color alone to convey meaning
- [ ] Badge icon clear in monochrome

---

## 🎨 Design Inspiration References

**Visual Direction:**

- **Blue Bottle Coffee**: Minimalist, clean, quality-focused
- **Arc Coffee**: Warm tones, modern aesthetic, cozy
- **Apple's App Icons**: Rounded corners, subtle gradients, depth
- **Material Design 3**: Smooth animations, warm neutrals

**Style Keywords:**

- Toasty aesthetic
- Smooth atmospheric
- Rounded geometry
- Single-line art
- Negative space
- Warm minimalism

---

## 📝 Implementation Notes

### File Organization

```
public/
├── icon-144x144.png
├── icon-192x192.png
├── icon-512x512.png
├── icon-192x192-safe.png
├── apple-touch-icon.png
├── favicon.ico
├── badge.png
├── screenshots/
│   ├── desktop-wide.png
│   └── mobile-narrow.png
└── shortcuts/
    ├── start.png
    └── settings.png
```

### Manifest Configuration

After creating assets, update `app/manifest.ts` to reference new files (already configured, just verify paths).

### Next Steps

1. Create master 1024×1024 icon using chosen method
2. Generate all required sizes
3. Optimize all PNGs
4. Create favicon.ico with multiple sizes
5. Capture app screenshots with new branding
6. Replace old assets in `public/` directory
7. Test PWA installation on multiple devices
8. Validate with Playwright tests

---

## 🚀 Success Criteria

**S-Tier Quality Achieved When:**
✨ Icon is instantly recognizable across all sizes
✨ Warm, inviting aesthetic that says "coffee break"
✨ Professional polish comparable to top App Store apps
✨ Perfect rendering on iOS, Android, Windows, macOS
✨ Maskable icon adapts beautifully to all platform shapes
✨ Cohesive visual language across all assets
✨ Accessibility standards exceeded

---

**Design Philosophy**: _Every pixel serves the purpose of creating a moment of calm in the user's day._
