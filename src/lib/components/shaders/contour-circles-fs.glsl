precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform int u_count;
uniform float u_centers[24]; // max 8 centers * 3
uniform vec3 u_color1;
uniform vec3 u_color2;

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float d = 10.0;

  for (int i = 0; i < 8; i++) {
    if (i >= u_count) break;

    vec2 c = vec2(
      u_centers[i*3],
      u_centers[i*3 + 1]
    );

    float r = u_centers[i*3 + 2];

    // subtle motion
    c += 0.03 * vec2(
      sin(u_time + float(i)),
      cos(u_time * 0.7 + float(i))
    );

    float cd = length(uv - c) - r;
    d = smin(d, cd, 0.25);
  }

  // Rings
  float freq = 12.0;
  float line = abs(fract(d * freq) - 0.5);

  float thickness = 0.1;
  float mask = step(line, thickness);

  vec3 col = mix(u_color2, u_color1, mask);

  gl_FragColor = vec4(col, 1.0);
}
