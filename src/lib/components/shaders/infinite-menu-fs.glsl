precision highp float;

uniform sampler2D uTexture;
uniform int uItemIndex;
uniform int uAtlasSize;
uniform int uItemCount;

varying vec2 vTexCoord;
varying float vAlpha;

void main() {
  int itemIndex = uItemIndex;
  if (uItemCount > 0) {
    itemIndex = int(mod(float(uItemIndex), float(uItemCount)));
  }

  int cellsPerRow = uAtlasSize;
  int cellX = int(mod(float(itemIndex), float(cellsPerRow)));
  int cellY = itemIndex / cellsPerRow;

  vec2 cellSize = vec2(1.0) / vec2(float(cellsPerRow));
  vec2 cellOffset = vec2(float(cellX), float(cellY)) * cellSize;

  vec2 st = vec2(vTexCoord.x, vTexCoord.y);
  st = st * cellSize + cellOffset;

  vec4 texColor = texture2D(uTexture, st);

  vec2 centered = vTexCoord * 2.0 - 1.0;
  float dist = length(centered);
  float circle = 1.0 - smoothstep(0.9, 1.0, dist);

  if (circle < 0.01) {
    discard;
  }

  float minBrightness = 0.05;
  float brightness = mix(minBrightness, 1.0, vAlpha);
  
  gl_FragColor = vec4(texColor.rgb * brightness, texColor.a * vAlpha * circle);
}