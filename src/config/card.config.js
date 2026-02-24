const HRATIO = 149;
const WRATIO = 208;
const RATIO = WRATIO / HRATIO;

export const GRID = {
  cols: 8,
  rows: 4,
  gapX: 1.4,
  gapY: 1.1,
};

const width = window.innerWidth;

function titleFontSize() {
  return '3.8vw';
}

function solutionFontSize() {
  return '1.6vw';
}

function categoryFontSize() {
  if (width < 576) return 8;
  if (width < 768) return 12;
  if (width < 1024) return 16;
  if (width < 1600) return 20;
  return 24;
}

function ctaFontSize() {
  if (width < 576) return 10;
  if (width < 768) return 12;
  if (width < 1024) return 14;
  if (width < 1600) return 16;
  return 18;
}

function sizeX() {
  if (width < 576) return 1;
  if (width < 768) return 1.25;
  if (width < 1024) return 1.5;
  if (width < 1600) return 1.75;
  return 2;
}

function sizeY() {
  if (width < 576) return 0.8;
  if (width < 768) return 0.95;
  if (width < 1024) return 1.2;
  if (width < 1600) return 1.4;
  return 1.5;
}

function sizeZ() {
  if (width <= 576) return 1.25;
  if (width <= 768) return 1.75;
  if (width <= 1024) return 2.2;
  if (width <= 1600) return 2.7;
  return 3;
}

const devicePixelRatio = window.devicePixelRatio || 1;
export const isRetina = devicePixelRatio > 1;

export const CARD = {
  size: [(sizeX() * ((isRetina) ? 1 : RATIO)) * ((isRetina) ? 1.5 : devicePixelRatio), 
          (sizeY() * ((isRetina) ? 1 : RATIO)) * ((isRetina) ? 1.5 : devicePixelRatio),
          0.02],
  titleFontSize: titleFontSize(),
  solutionFontSize: solutionFontSize(),
  categoryFontSize: categoryFontSize(),
  ctaFontSize: ctaFontSize(),
};
console.log("width", width);
console.log("CARD size", CARD.size);

export const FOCUS = {
  z: sizeZ(),
  scale: 1.25,
  moveDuration: 0.45,
  flipDuration: 0.55,
};

export const DIM = {
  opacity: 0.18,
  z: -0.25,
  scale: 0.95,
  duration: 0.25,
};

export const TEXTURES = {
  dir: "cards",
  ext: "webp",
  count: 32,
};
