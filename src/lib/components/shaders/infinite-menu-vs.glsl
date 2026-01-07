precision highp float;

attribute vec3 aPosition;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

uniform vec3 uDiscPosition;
uniform float uDiscScale;
uniform vec3 uRotationAxis;
uniform float uRotationVelocity;
uniform float uSphereRadius;

varying vec2 vTexCoord;
varying float vAlpha;

void main() {
  vec3 pos = aPosition * uDiscScale;

  vec3 forward = normalize(uDiscPosition);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
  if (length(right) < 0.001) {
    right = normalize(cross(vec3(1.0, 0.0, 0.0), forward));
  }
  vec3 up = normalize(cross(forward, right));

  vec3 worldPos = uDiscPosition + right * pos.x + up * pos.y;

  if (length(aPosition) > 0.001) {
    vec3 stretchDir = normalize(cross(uDiscPosition, uRotationAxis));
    vec3 relativeVertexPos = normalize(worldPos - uDiscPosition);
    float strength = dot(stretchDir, relativeVertexPos);
    float invAbsStrength = min(0.0, abs(strength) - 1.0);
    float rotVel = min(0.15, uRotationVelocity * 15.0);
    strength = rotVel * sign(strength) * abs(invAbsStrength * invAbsStrength * invAbsStrength + 1.0);
    worldPos += stretchDir * strength;
  }

  worldPos = uSphereRadius * normalize(worldPos);

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(worldPos, 1.0);

  vTexCoord = aTexCoord;
  vAlpha = smoothstep(0.5, 1.0, normalize(worldPos).z) * 0.9 + 0.1;
}