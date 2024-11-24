export const vertexShader = `
in vec3 position;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec3 vPosition;
out vec2 vUv;

void main() {
    vPosition = position;
    vUv = uv; // Передача UV координат
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
