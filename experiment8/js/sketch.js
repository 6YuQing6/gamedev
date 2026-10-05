/* global Fish */
/* exported setup, draw */

// Use the game's generator without loading its fishing or aquarium scenes.
const fishParams = {
  minWidth: 300,
  maxWidth: 1000,
  minHeight: 200,
  maxHeight: 800,
};

let generatedFish;
let fishBounds;
let fishCanvas;
let canvasObserver;

function canvasSize() {
  const container = document.getElementById("canvas-container");
  const style = getComputedStyle(container);
  const availableWidth = Math.max(
    1,
    Math.floor(
      container.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight),
    ),
  );
  return {
    width: availableWidth,
    height: Math.round(Math.min(440, Math.max(260, availableWidth * 0.6))),
  };
}

function setup() {
  const dimensions = canvasSize();
  fishCanvas = createCanvas(dimensions.width, dimensions.height);
  fishCanvas.parent("canvas-container");
  fishCanvas.elt.setAttribute("role", "img");
  fishCanvas.elt.setAttribute("aria-label", "A randomly generated pixel fish");
  pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
  noSmooth();
  noLoop();
  document.getElementById("reroll").addEventListener("click", rerollFish);
  rerollFish();
  canvasObserver = new ResizeObserver(() => {
    const nextSize = canvasSize();
    if (nextSize.width !== width || nextSize.height !== height) {
      resizeCanvas(nextSize.width, nextSize.height);
      redraw();
    }
  });
  canvasObserver.observe(document.getElementById("canvas-container"));
}

function rerollFish() {
  const seed = crypto.getRandomValues(new Uint32Array(1))[0] || 1;
  colorMode(RGB, 255);
  noiseSeed(seed);
  // Explicit text keeps generation independent of the game's Tracery library.
  const nextFish = new Fish(seed, "Generated fish", "A procedural pixel fish.");
  if (generatedFish) {
    generatedFish.buffer.remove();
    generatedFish.pixelbuffer.remove();
  }
  generatedFish = nextFish;
  fishBounds = visibleBounds(generatedFish.pixelbuffer);
  fishCanvas.elt.dataset.seed = String(seed);
  redraw();
}

function visibleBounds(buffer) {
  buffer.loadPixels();
  // p5 graphics may retain fractional dimensions; pixels use integer canvas sizes.
  const pixelWidth = buffer.canvas.width;
  const pixelHeight = buffer.canvas.height;
  let left = pixelWidth;
  let top = pixelHeight;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < pixelHeight; y++) {
    for (let x = 0; x < pixelWidth; x++) {
      if (buffer.pixels[4 * (y * pixelWidth + x) + 3] > 0) {
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
    }
  }
  if (right < left)
    throw new Error("The fish generator produced an empty image.");
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

function draw() {
  background(255);
  if (!generatedFish) return;
  const scaleRatio = Math.min(
    (width * 0.75) / fishBounds.width,
    (height * 0.7) / fishBounds.height,
    1.5,
  );
  const drawWidth = fishBounds.width * scaleRatio;
  const drawHeight = fishBounds.height * scaleRatio;
  imageMode(CORNER);
  image(
    generatedFish.pixelbuffer,
    (width - drawWidth) / 2,
    (height - drawHeight) / 2,
    drawWidth,
    drawHeight,
    fishBounds.left,
    fishBounds.top,
    fishBounds.width,
    fishBounds.height,
  );
}
