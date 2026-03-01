precision highp float;

varying vec2 vUv;

const int MAX_BALLS = 32;
const int MAX_LIGHTS = 8;

uniform float uTime;
uniform vec3 uCamPos;
uniform mat4 uInvProj;
uniform mat4 uCamMat;
uniform vec4 uBalls[MAX_BALLS];
uniform int uCount;
uniform float uSmooth;
uniform vec3 uBaseColor;

// Scene lights
uniform vec3 uAmbientColor;
uniform float uAmbientIntensity;
uniform int uDirLightCount;
uniform vec3 uDirLightDirs[MAX_LIGHTS];
uniform vec3 uDirLightColors[MAX_LIGHTS];
uniform float uDirLightIntensities[MAX_LIGHTS];

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
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
    ));
}

float raymarch(vec3 ro, vec3 rd) {
    float t = 0.0;
    for (int i = 0; i < 150; i++) {
        float d = map(ro + rd * t);
        if (d < 0.0003) return t;
        if (t > 25.0) break;
        t += d * 0.8;
    }
    return -1.0;
}

vec3 envColor(vec3 rd) {
    float y = rd.y * 0.5 + 0.5;
    vec3 sky = mix(vec3(0.6, 0.7, 0.9), vec3(0.3, 0.5, 0.9), y);
    return sky;
}

void main() {
    vec2 ndc = vUv * 2.0 - 1.0;

    vec4 vp = uInvProj * vec4(ndc, -1.0, 1.0);
    vp.xyz /= vp.w;

    vec3 rd = normalize((uCamMat * vec4(normalize(vp.xyz), 0.0)).xyz);
    vec3 ro = uCamPos;

    float t = raymarch(ro, rd);

    if (t < 0.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        return;
    }

    vec3 p = ro + rd * t;
    vec3 n = calcNormal(p);
    vec3 V = normalize(ro - p);
    vec3 R = reflect(-V, n);

    // Fresnel (Schlick) - strong for plastic/glossy look
    float F0base = 0.08;
    float fres = F0base + (1.0 - F0base) * pow(1.0 - max(dot(n, V), 0.0), 5.0);

    vec3 base = uBaseColor;

    // Ambient
    vec3 col = base * uAmbientColor * uAmbientIntensity;

    // Directional lights - plastic/glossy Blinn-Phong
    for (int i = 0; i < MAX_LIGHTS; i++) {
        if (i >= uDirLightCount) break;

        vec3 L = normalize(uDirLightDirs[i]);
        vec3 lCol = uDirLightColors[i] * uDirLightIntensities[i];
        vec3 H = normalize(L + V);

        // Diffuse - slightly wrapped for softer look
        float wrap = max((dot(n, L) + 0.3) / 1.3, 0.0);
        col += base * lCol * wrap * 0.7;

        // Specular - high shininess for glossy plastic
        float spec = pow(max(dot(n, H), 0.0), 180.0);
        col += lCol * spec * 1.2;

        // Secondary broader specular lobe for plastic sheen
        float spec2 = pow(max(dot(n, H), 0.0), 32.0);
        col += lCol * spec2 * 0.15;
    }

    // Environment reflection - glossy plastic reflects environment
    vec3 envRef = envColor(R);
    col += envRef * fres * 0.6;

    // Rim light for plastic edge glow
    float rim = pow(1.0 - max(dot(n, V), 0.0), 3.0);
    col += vec3(0.8, 0.85, 1.0) * rim * 0.25;

    // Subsurface scattering approximation
    for (int i = 0; i < MAX_LIGHTS; i++) {
        if (i >= uDirLightCount) break;
        vec3 L = normalize(uDirLightDirs[i]);
        vec3 lCol = uDirLightColors[i] * uDirLightIntensities[i];
        float sss = pow(max(dot(V, -L), 0.0), 4.0) * 0.08;
        col += base * lCol * sss;
    }

    // ACES tone mapping
    col = (col * (2.51 * col + 0.03)) / (col * (2.43 * col + 0.59) + 0.14);
    col = pow(clamp(col, 0.0, 1.0), vec3(1.0 / 2.2));

    gl_FragColor = vec4(col, 1.0);
}