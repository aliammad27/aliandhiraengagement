type Rgba = readonly [number, number, number, number];

const SIZE = 32;
const SAGE: Rgba = [79, 111, 91, 255];
const GOLD: Rgba = [216, 184, 106, 255];
const IVORY: Rgba = [255, 250, 242, 255];
const PINK: Rgba = [216, 143, 156, 255];

const H = ["10001", "10001", "10001", "11111", "10001", "10001", "10001"];
const A = ["01110", "10001", "10001", "11111", "10001", "10001", "10001"];

export const dynamic = "force-static";

function setPixel(pixels: Uint8Array, x: number, y: number, color: Rgba) {
  if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return;

  const index = (y * SIZE + x) * 4;
  pixels[index] = color[0];
  pixels[index + 1] = color[1];
  pixels[index + 2] = color[2];
  pixels[index + 3] = color[3];
}

function fillRect(pixels: Uint8Array, x: number, y: number, width: number, height: number, color: Rgba) {
  for (let row = y; row < y + height; row += 1) {
    for (let col = x; col < x + width; col += 1) {
      setPixel(pixels, col, row, color);
    }
  }
}

function fillCircle(pixels: Uint8Array, centerX: number, centerY: number, radius: number, color: Rgba) {
  const radiusSquared = radius * radius;

  for (let y = centerY - radius; y <= centerY + radius; y += 1) {
    for (let x = centerX - radius; x <= centerX + radius; x += 1) {
      const dx = x - centerX;
      const dy = y - centerY;
      if (dx * dx + dy * dy <= radiusSquared) {
        setPixel(pixels, x, y, color);
      }
    }
  }
}

function drawRing(pixels: Uint8Array, centerX: number, centerY: number, radius: number, thickness: number, color: Rgba) {
  const outer = radius * radius;
  const inner = (radius - thickness) * (radius - thickness);

  for (let y = centerY - radius; y <= centerY + radius; y += 1) {
    for (let x = centerX - radius; x <= centerX + radius; x += 1) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = dx * dx + dy * dy;
      if (distance <= outer && distance >= inner) {
        setPixel(pixels, x, y, color);
      }
    }
  }
}

function drawPattern(pixels: Uint8Array, pattern: string[], x: number, y: number, scale: number, color: Rgba) {
  pattern.forEach((row, rowIndex) => {
    [...row].forEach((cell, colIndex) => {
      if (cell !== "1") return;
      fillRect(pixels, x + colIndex * scale, y + rowIndex * scale, scale, scale, color);
    });
  });
}

function makePixels() {
  const pixels = new Uint8Array(SIZE * SIZE * 4);

  fillRect(pixels, 0, 0, SIZE, SIZE, SAGE);
  fillCircle(pixels, 16, 16, 12, PINK);
  drawRing(pixels, 16, 16, 12, 1, GOLD);
  drawRing(pixels, 16, 16, 14, 1, [255, 250, 242, 48]);

  drawPattern(pixels, H, 5, 9, 2, IVORY);
  fillRect(pixels, 15, 15, 2, 2, GOLD);
  fillRect(pixels, 15, 20, 2, 1, GOLD);
  drawPattern(pixels, A, 18, 9, 2, IVORY);

  return pixels;
}

function makeFaviconIco() {
  const pixels = makePixels();
  const maskStride = Math.ceil(SIZE / 32) * 4;
  const xorSize = SIZE * SIZE * 4;
  const maskSize = maskStride * SIZE;
  const dibSize = 40 + xorSize + maskSize;
  const icoSize = 6 + 16 + dibSize;
  const ico = new Uint8Array(icoSize);
  const view = new DataView(ico.buffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, 1, true);

  ico[6] = SIZE;
  ico[7] = SIZE;
  ico[8] = 0;
  ico[9] = 0;
  view.setUint16(10, 1, true);
  view.setUint16(12, 32, true);
  view.setUint32(14, dibSize, true);
  view.setUint32(18, 22, true);

  const dibOffset = 22;
  view.setUint32(dibOffset, 40, true);
  view.setInt32(dibOffset + 4, SIZE, true);
  view.setInt32(dibOffset + 8, SIZE * 2, true);
  view.setUint16(dibOffset + 12, 1, true);
  view.setUint16(dibOffset + 14, 32, true);
  view.setUint32(dibOffset + 16, 0, true);
  view.setUint32(dibOffset + 20, xorSize, true);
  view.setInt32(dibOffset + 24, 0, true);
  view.setInt32(dibOffset + 28, 0, true);
  view.setUint32(dibOffset + 32, 0, true);
  view.setUint32(dibOffset + 36, 0, true);

  let target = dibOffset + 40;
  for (let y = SIZE - 1; y >= 0; y -= 1) {
    for (let x = 0; x < SIZE; x += 1) {
      const source = (y * SIZE + x) * 4;
      ico[target] = pixels[source + 2];
      ico[target + 1] = pixels[source + 1];
      ico[target + 2] = pixels[source];
      ico[target + 3] = pixels[source + 3];
      target += 4;
    }
  }

  return ico;
}

export function GET() {
  return new Response(makeFaviconIco(), {
    headers: {
      "Content-Type": "image/x-icon",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
