export const fragmentShaderX = `
precision highp float;
precision highp sampler3D;

uniform sampler3D map;
uniform int sliceX;
uniform int textureHeight;
uniform int textureDepth;

in vec2 vUv;

out vec4 fragColor;

void main() {
    // Получаем координаты по Y и Z
    float z = vUv.x; // Отражение вдоль оси Y
    float y = vUv.y; // Отражение вдоль оси Z

    // Преобразуем в целочисленные координаты
    int yInt = int(round(y * float(textureHeight - 1)));
    int zInt = int(round(z * float(textureDepth - 1)));

    // Получаем значения текстуры по всем каналам
    vec4 texel = texelFetch(map, ivec3(sliceX, yInt, zInt), 0);
    // vec4 texel = vec4(vec2(vUv.x, vUv.y), 0, 1);
    
    // Используем все каналы для цвета
    fragColor = texel; // Отображение как есть (r, g, b, a)
}
`;

export const fragmentShaderY = `
precision highp float;
precision highp sampler3D;

uniform sampler3D map;
uniform int sliceY;
uniform int textureWidth;
uniform int textureDepth;

in vec2 vUv;

out vec4 fragColor;

void main() {
    // Получаем координаты по X и Z
    float x = vUv.x;
    float z = vUv.y;

    // Преобразуем в целочисленные координаты
    int xInt = int(round(x * float(textureWidth - 1)));
    int zInt = int(round(z * float(textureDepth - 1)));

    // Получаем значение текстуры по срезу Y
    vec4 texel = texelFetch(map, ivec3(xInt, sliceY, zInt), 0);
    

    fragColor = texel;
}
`;

export const fragmentShaderZ = `
precision highp float;
precision highp sampler3D;

uniform sampler3D map;
uniform int sliceZ;
uniform int textureWidth;
uniform int textureHeight;

in vec2 vUv;

out vec4 fragColor;

void main() {
    // Получаем координаты по X и Y
    float x = vUv.x;
    float y = vUv.y;

    // Преобразуем в целочисленные координаты
    int xInt = int(round(x * float(textureWidth - 1)));
    int yInt = int(round(y * float(textureHeight - 1)));

    // Получаем значение текстуры по срезу Z
    vec4 texel = texelFetch(map, ivec3(xInt, yInt, sliceZ), 0); 

    // Устанавливаем цвет (синий канал)
    fragColor = texel;
}
`;
