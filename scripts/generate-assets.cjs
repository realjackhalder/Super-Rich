const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SOURCE_IMG = path.join(PUBLIC_DIR, 'diamond-crystal-.jpeg');
const APP_DIR = path.join(__dirname, '..', 'app');

function createIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  let currentOffset = 6 + count * 16;
  const dirEntries = [];
  const imageBuffers = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.buffer.length, 8);
    entry.writeUInt32LE(currentOffset, 12);
    dirEntries.push(entry);
    imageBuffers.push(img.buffer);
    currentOffset += img.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
}

async function main() {
  console.log('Generating luxury diamond logo and favicon assets from public/diamond-crystal-.jpeg...');

  if (!fs.existsSync(SOURCE_IMG)) {
    throw new Error(`Source image not found: ${SOURCE_IMG}`);
  }

  // Extract the diamond gem tightly from diamond-crystal-.jpeg
  // Diamond bounds: left: 2, top: 74, width: 496, height: 302
  const tightGem = await sharp(SOURCE_IMG)
    .extract({ left: 2, top: 74, width: 496, height: 302 })
    .toBuffer();

  // Create transparent 512x512 Master Logo (Diamond centered with comfortable luxury margins)
  const gemResized = await sharp(tightGem)
    .resize(480, 292, { fit: 'contain' })
    .toBuffer();

  const logoTransparent512 = await sharp({
    create: { width: 512, height: 512, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  }).composite([{ input: gemResized, gravity: 'center' }])
    .png()
    .toBuffer();

  // Write logo files
  fs.writeFileSync(path.join(PUBLIC_DIR, 'logo.png'), logoTransparent512);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'logo-light.png'), logoTransparent512);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'logo-dark.png'), logoTransparent512);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon.png'), logoTransparent512);
  console.log('✓ Created public/logo.png, public/logo-light.png, public/logo-dark.png, public/icon.png');

  // Apple Touch Icon (180x180)
  const appleTouchIcon = await sharp(logoTransparent512)
    .resize(180, 180, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(PUBLIC_DIR, 'apple-touch-icon.png'), appleTouchIcon);
  console.log('✓ Created public/apple-touch-icon.png (180x180)');

  // Icon 64 (64x64)
  const icon64 = await sharp(logoTransparent512)
    .resize(64, 64, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-64.png'), icon64);
  console.log('✓ Created public/icon-64.png (64x64)');

  // Favicons: 32x32 and 16x16 with sharpening for maximum clarity
  const fav32 = await sharp(logoTransparent512)
    .resize(32, 32, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 1, m1: 1.5, m2: 0.5 })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-32x32.png'), fav32);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-light.png'), fav32);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-dark.png'), fav32);
  console.log('✓ Created public/favicon-32x32.png, public/favicon-light.png, public/favicon-dark.png');

  const fav16 = await sharp(logoTransparent512)
    .resize(16, 16, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 1, m1: 2, m2: 0.5 })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-16x16.png'), fav16);
  console.log('✓ Created public/favicon-16x16.png');

  const fav48 = await sharp(logoTransparent512)
    .resize(48, 48, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();

  // Multi-resolution favicon.ico (16x16, 32x32, 48x48)
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: fav16 },
    { width: 32, height: 32, buffer: fav32 },
    { width: 48, height: 48, buffer: fav48 }
  ]);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);
  console.log('✓ Created public/favicon.ico (multi-resolution 16, 32, 48)');

  // 6. Responsive Scalable SVG Icon (public/icon.svg)
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <!-- Facet Gradients -->
    <linearGradient id="tableGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="45%" stop-color="#E0F2FE" />
      <stop offset="100%" stop-color="#BAE6FD" />
    </linearGradient>

    <linearGradient id="starLeft" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#7DD3FC" />
    </linearGradient>

    <linearGradient id="starRight" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="60%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#818CF8" />
    </linearGradient>

    <linearGradient id="centerKite" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="70%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#94A3B8" />
    </linearGradient>

    <linearGradient id="pavilionLeft" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E0F2FE" />
      <stop offset="60%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>

    <linearGradient id="pavilionCenter" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#CBD5E1" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>

    <linearGradient id="pavilionRight" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F0F9FF" />
      <stop offset="40%" stop-color="#C084FC" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>

    <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#818CF8" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#F472B6" stop-opacity="0.6" />
    </linearGradient>

    <filter id="diamondGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#38BDF8" flood-opacity="0.35" />
    </filter>
  </defs>

  <style>
    .bg-badge { fill: #000000; }
    .facet-border { stroke: rgba(255, 255, 255, 0.4); stroke-width: 0.75; stroke-linejoin: round; }
  </style>

  <!-- Luxury Obsidian Rounded Squircle Badge -->
  <rect class="bg-badge" x="4" y="4" width="120" height="120" rx="28" stroke="url(#rimGrad)" stroke-width="1.5" />

  <!-- Brilliant Cut Diamond -->
  <g filter="url(#diamondGlow)" class="facet-border">
    <!-- CROWN FACETS -->
    <!-- Table Facet (Top Center) -->
    <polygon points="44,38 84,38 98,54 30,54" fill="url(#tableGrad)" />

    <!-- Upper Crown Left -->
    <polygon points="12,54 30,54 44,38 34,38" fill="url(#starLeft)" opacity="0.9" />

    <!-- Upper Crown Right -->
    <polygon points="84,38 94,38 116,54 98,54" fill="url(#starRight)" opacity="0.95" />

    <!-- Crown Center Kite -->
    <polygon points="44,38 64,54 84,38 64,34" fill="#FFFFFF" opacity="0.95" />

    <!-- Star Left Middle -->
    <polygon points="30,54 64,54 44,38" fill="url(#starLeft)" opacity="0.85" />

    <!-- Star Right Middle -->
    <polygon points="64,54 98,54 84,38" fill="url(#starRight)" opacity="0.85" />

    <!-- GIRDLE POINTS: (12, 54) to (116, 54) -->
    <!-- PAVILION FACETS (Lower Cone to Culet at 64, 98) -->
    <!-- Outer Left Pavilion -->
    <polygon points="12,54 34,54 64,98" fill="url(#pavilionLeft)" opacity="0.95" />

    <!-- Mid Left Pavilion -->
    <polygon points="34,54 52,54 64,98" fill="#F8FAFC" opacity="0.9" />

    <!-- Center Pavilion Core -->
    <polygon points="52,54 76,54 64,98" fill="url(#pavilionCenter)" />

    <!-- Mid Right Pavilion -->
    <polygon points="76,54 94,54 64,98" fill="#F1F5F9" opacity="0.9" />

    <!-- Outer Right Pavilion -->
    <polygon points="94,54 116,54 64,98" fill="url(#pavilionRight)" opacity="0.95" />
  </g>

  <!-- Sparkle Flare Starburst (Top Right) -->
  <g transform="translate(94, 38)">
    <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="#FFFFFF" />
    <circle cx="0" cy="0" r="2.5" fill="#E0F2FE" />
  </g>

  <!-- Sparkle Flare Small (Left Girdle) -->
  <g transform="translate(18, 54) scale(0.6)">
    <polygon points="0,-10 2.5,-2.5 10,0 2.5,2.5 0,10 -2.5,2.5 -10,0 -2.5,-2.5" fill="#FFFFFF" opacity="0.9" />
  </g>
</svg>
`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon.svg'), svgContent.trim());
  console.log('✓ Created public/icon.svg (Scalable vector diamond with flare)');

  console.log('All luxury diamond assets successfully generated!');
}

main().catch(console.error);
