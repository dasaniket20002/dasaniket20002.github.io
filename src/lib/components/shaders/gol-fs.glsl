precision mediump float;

varying vec2 vTexCoord;
uniform sampler2D uCellTexture;
uniform vec2 uGridSize;
uniform float uCornerRadius;
uniform vec3 uAliveColor;
uniform vec3 uDeadColor;

// Signed distance function for rounded rectangle
float sdRoundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y; // Flip Y to match p5.js coordinates
  
  // Calculate which cell we're in
  vec2 cellCoord = uv * uGridSize;
  vec2 cellIndex = floor(cellCoord);
  vec2 cellUV = fract(cellCoord); // Position within cell (0-1)
  
  // Get cell value from texture (sample at cell center)
  vec2 texCoord = (cellIndex + 0.5) / uGridSize;
  float cellValue = texture2D(uCellTexture, texCoord).r;
  
  // Calculate squircle using SDF
  vec2 p = cellUV - 0.5; // Center the coordinate
  float halfSize = 0.5;
  float d = sdRoundedBox(p, vec2(halfSize), uCornerRadius);
  
  // Anti-aliased edge
  float edge = smoothstep(0.01, -0.01, d);
  
  // Interpolate between dead and alive colors
  vec3 cellColor = mix(uDeadColor, uAliveColor, cellValue);
  vec3 bgColor = uDeadColor; // Background color
  
  vec3 finalColor = mix(bgColor, cellColor, edge);
  gl_FragColor = vec4(finalColor, 1.0);
}