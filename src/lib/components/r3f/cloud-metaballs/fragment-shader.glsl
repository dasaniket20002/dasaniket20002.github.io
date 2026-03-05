precision highp float;

#include <common>
#include <packing>
#include <lights_pars_begin>

const int MAX_BALLS = 16;

uniform vec4  uBalls[MAX_BALLS];
uniform int   uCount;
uniform float uSmooth;
uniform vec3  uBaseColor;
uniform float uRoughness;
uniform float uMetalness;
uniform float uStepThreshold;
uniform float uStepFactor;

uniform vec4  uBounds;                   // .xyz = centre, .w = radius

uniform mat4  uProjectionMatrix;
uniform mat4  uInverseProjectionMatrix;
uniform mat4  uCameraMatrix;

varying vec2  vUv;

/* ═══════════════════════════════════════════════════════════════
   SDF
   ═══════════════════════════════════════════════════════════════ */

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float map(vec3 p) {
  float d = 1e10;
  for (int i = 0; i < MAX_BALLS; i++) {
    if (i >= uCount) break;
    d = smin(d, length(p - uBalls[i].xyz) - uBalls[i].w, uSmooth);
  }
  return d;
}

vec3 calcNormal(vec3 p) {
  const vec2  k = vec2(1.0, -1.0);
  const float e = 0.001;
  return normalize(
    k.xyy * map(p + k.xyy * e) +
    k.yyx * map(p + k.yyx * e) +
    k.yxy * map(p + k.yxy * e) +
    k.xxx * map(p + k.xxx * e));
}

vec2 iSphere(vec3 ro, vec3 rd, vec4 s) {
  vec3  oc  = ro - s.xyz;
  float b   = dot(oc, rd);
  float c   = dot(oc, oc) - s.w * s.w;
  float det = b * b - c;
  if (det < 0.0) return vec2(-1.0);
  det = sqrt(det);
  return vec2(-b - det, -b + det);          // (tNear, tFar)
}

float raymarch(vec3 ro, vec3 rd) {
  vec2 bound = iSphere(ro, rd, uBounds);
  if (bound.y < 0.0) return -1.0;

  float t    = max(bound.x, 0.0);
  float tMax = min(bound.y + 0.5, 25.0);

  for (int i = 0; i < 96; i++) {
    float d = map(ro + rd * t);
    if (d < uStepThreshold) return t;
    t += d * uStepFactor;
    if (t > tMax) return -1.0;
  }
  return -1.0;
}

/* ═══════════════════════════════════════════════════════════════
   PBR 
   ═══════════════════════════════════════════════════════════════ */

float pow5(float x) { float x2 = x * x; return x2 * x2 * x; }

// accepts pre-squared a2 so the caller computes it once
float D_GGX(float NdotH, float a2) {
  float d = NdotH * NdotH * (a2 - 1.0) + 1.0;
  return a2 / (PI * d * d);
}

// Combined G / (4·NdotV·NdotL)
float V_SmithSchlick(float NdotV, float NdotL, float k) {
  return 0.25 / max((NdotV * (1.0 - k) + k) *
                    (NdotL * (1.0 - k) + k), 1e-6);
}

vec3 F_Schlick(float cosTheta, vec3 F0) {
  return F0 + (1.0 - F0) * pow5(1.0 - cosTheta);
}

vec3 evalBRDF(vec3 N, vec3 V, vec3 L, vec3 radiance,
              vec3 albedo, vec3 F0, float a2, float k,
              float metalness, float NdotV) {

  float NdotL = dot(N, L);
  if (NdotL <= 0.0) return vec3(0.0);

  vec3  H     = normalize(L + V);
  float NdotH = max(dot(N, H), 0.0);
  float VdotH = max(dot(V, H), 0.0);

  float D   = D_GGX(NdotH, a2);
  float Vis = V_SmithSchlick(NdotV, NdotL, k);
  vec3  F   = F_Schlick(VdotH, F0);

  vec3 spec = D * Vis * F;
  vec3 diff = (1.0 - F) * (1.0 - metalness) * albedo * (1.0 / PI);

  return (diff + spec) * radiance * NdotL;
}

float distAtten(float dist, float cutoff) {
  float d2 = dist * dist;
  if (cutoff > 0.0) {
    float r = dist / cutoff;
    float r2 = r * r;  float r4 = r2 * r2;
    float w  = saturate(1.0 - r4);
    return w * w / (d2 + 1.0);
  }
  return 1.0 / (d2 + 1e-4);
}

/* ═══════════════════════════════════════════════════════════════
   Main
   ═══════════════════════════════════════════════════════════════ */

void main() {
  vec2 ndc = vUv * 2.0 - 1.0;

  vec4 vp = uInverseProjectionMatrix * vec4(ndc, -1.0, 1.0);
  vp.xyz /= vp.w;

  vec3 rd = normalize((uCameraMatrix * vec4(vp.xyz, 0.0)).xyz);
  vec3 ro = cameraPosition;

  float t = raymarch(ro, rd);
  if (t < 0.0) discard;

  vec3 p = ro + rd * t;
  vec3 N = calcNormal(p);
  vec3 V = -rd;

  /* ── depth ────────────────────────────────────────────── */
  vec4 clip = uProjectionMatrix * viewMatrix * vec4(p, 1.0);
  gl_FragDepth = clip.z / clip.w * 0.5 + 0.5;

  /* ── material constants ────────────────── */
  vec3  albedo = uBaseColor;
  float rough  = clamp(uRoughness, 0.04, 1.0);
  float metal  = clamp(uMetalness, 0.0,  1.0);
  float a      = rough * rough;
  float a2     = a * a;
  float k      = rough + 1.0;  k = k * k * 0.125;
  float NdotV  = max(dot(N, V), 0.001);
  vec3  F0     = mix(vec3(0.04), albedo, metal);

  vec3 Lo = albedo * ambientLightColor;

  /* ── directional ─────────────────── */
  #if NUM_DIR_LIGHTS > 0
  for (int i = 0; i < NUM_DIR_LIGHTS; i++) {
    vec3 L = normalize(mat3(uCameraMatrix) * directionalLights[i].direction);
    Lo += evalBRDF(N, V, L, directionalLights[i].color,
                   albedo, F0, a2, k, metal, NdotV);
  }
  #endif

  /* ── point ────────────────────────────────────── */
  #if NUM_POINT_LIGHTS > 0
  for (int i = 0; i < NUM_POINT_LIGHTS; i++) {
    vec3  dv  = (uCameraMatrix * vec4(pointLights[i].position, 1.0)).xyz - p;
    float dst = length(dv);
    Lo += evalBRDF(N, V, dv / dst,
                   pointLights[i].color * distAtten(dst, pointLights[i].distance),
                   albedo, F0, a2, k, metal, NdotV);
  }
  #endif

  /* ── spot ──────────────────────────────────────────────── */
  #if NUM_SPOT_LIGHTS > 0
  for (int i = 0; i < NUM_SPOT_LIGHTS; i++) {
    vec3  dv   = (uCameraMatrix * vec4(spotLights[i].position, 1.0)).xyz - p;
    float dst  = length(dv);
    vec3  L    = dv / dst;
    vec3  sDir = normalize(mat3(uCameraMatrix) * spotLights[i].direction);
    float cone = smoothstep(spotLights[i].coneCos,
                             spotLights[i].penumbraCos, dot(L, sDir));
    Lo += evalBRDF(N, V, L,
                   spotLights[i].color * distAtten(dst, spotLights[i].distance) * cone,
                   albedo, F0, a2, k, metal, NdotV);
  }
  #endif

  /* ── env + rim ────────────────────────────────────────── */
  vec3 R  = reflect(-V, N);
  vec3 Fr = F_Schlick(NdotV, F0);
  Lo += mix(vec3(0.6, 0.7, 0.9), vec3(0.3, 0.5, 0.9), R.y * 0.5 + 0.5)
        * Fr * (1.0 - rough) * 0.3;

  float rim = 1.0 - max(dot(N, V), 0.0);
  Lo += vec3(0.8, 0.85, 1.0) * (rim * rim * rim) * 0.15;

  gl_FragColor = vec4(Lo, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}