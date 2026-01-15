precision highp float;

varying vec2 vTexCoord;

uniform sampler2D u_noiseTexture;
uniform vec3 u_color0;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;

// HSB to RGB conversion
// Input: H in [0, 360], S and B in [0, 100+]
vec3 hsb2rgb(vec3 c) {
  float h = c.x / 360.0;
  float s = clamp(c.y / 100.0, 0.0, 1.0);
  float b = clamp(c.z / 100.0, 0.0, 1.0);

  vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  return b * mix(vec3(1.0), rgb, s);
}

// Get color from palette by index
vec3 getColor(int idx) {
  if (idx == 0) return u_color0;
  if (idx == 1) return u_color1;
  if (idx == 2) return u_color2;
  if (idx == 3) return u_color3;
  return u_color4;
}

void main() {
  // Read from noise texture:
  // R channel: noise value (0-1)
  // G channel: random multiplier encoded (0 = 9, 1 = 10)
  vec4 texData = texture2D(u_noiseTexture, vTexCoord);
  float n = texData.r;
  float randMult = texData.g > 0.5 ? 10.0 : 9.0;

  float skipNum = 5.0;

  float colNum = n * 5.0;
  float colNum2 = fract(colNum / 10.0) * randMult;

  // Wrap colNum2 to valid range
  if (colNum2 > 10.0) colNum2 -= 10.0;
  if (colNum2 > 5.0) colNum2 -= 5.0;

  float check = floor(colNum2 * skipNum);

  // Alternate between black and palette colors
  if (mod(check, 2.0) < 0.5) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } else {
    int col = int(floor(colNum2));
    vec3 palette = getColor(col);

    // Modify brightness based on fractional part
    float brightness = palette.z - fract(colNum2) * 50.0;
    vec3 hsb = vec3(palette.x, palette.y, brightness);
    vec3 rgb = hsb2rgb(hsb);

    gl_FragColor = vec4(rgb, 1.0);
  }
}