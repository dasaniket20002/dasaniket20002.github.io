precision highp float;

uniform sampler2D uCellTexture;
uniform vec2 uGridSize;
uniform vec3 uAliveColor;
uniform vec3 uDeadColor;
uniform float uCornerRadius;

varying vec2 vUv;

// Signed distance function for rounded rectangle
float sdRoundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
  // Calculate which cell we're in
  vec2 cellCoord = vUv * uGridSize;
  vec2 cellIndex = floor(cellCoord);
  vec2 cellUV = fract(cellCoord); // Position within cell (0-1)
  
  // Get cell value from texture (sample at cell center)
  vec2 texCoord = (cellIndex + 0.5) / uGridSize;
  float cellValue = texture2D(uCellTexture, texCoord).r;
  
  // Calculate squircle using SDF
  vec2 p = cellUV - 0.5; // Center the coordinate
  float halfSize = 0.45; // Slight gap between cells
  float d = sdRoundedBox(p, vec2(halfSize), uCornerRadius * halfSize);
  
  // Anti-aliased edge
  float pixelSize = 1.0 / min(uGridSize.x, uGridSize.y);
  float edge = smoothstep(pixelSize, -pixelSize, d);
  
  // Interpolate between dead and alive colors
  vec3 cellColor = mix(uDeadColor, uAliveColor, cellValue);
  vec3 finalColor = mix(uDeadColor, cellColor, edge);
  
  gl_FragColor = vec4(finalColor, 1.0);
}