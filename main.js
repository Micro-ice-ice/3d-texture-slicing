import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { vertexShader } from './shaders/vertex.glsl.js';
import { fragmentShaderX, fragmentShaderY, fragmentShaderZ } from './shaders/fragment.glsl.js';
import * as dat from 'dat.gui';

// Создаем сцену
const scene = new THREE.Scene();

// Создаем камеру
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Создаем рендерер
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Позиционируем камеру
camera.position.z = 5;

// Добавляем OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

const nx = 256;
const ny = 256;
const nz = 256;
const size = nx * ny * nz;

// Теперь массив данных содержит три канала на каждый воксель
const data = new Uint8Array(size * 4);

let i = 0;
for (let z = 0; z < nz; z++) {
    for (let y = 0; y < ny; y++) {
        for (let x = 0; x < nx; x++) {
            // Смешиваем каналы для плавного перехода
            data[i++] = x;
            data[i++] = y;
            data[i++] = z;
            data[i++] = 255;
        }
    }
}

// Создание текстуры
const texture = new THREE.Data3DTexture(data, nx, ny, nz);
texture.format = THREE.RGBAFormat; // Меняем формат на RGBA
texture.type = THREE.UnsignedByteType;
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.unpackAlignment = 1;
texture.needsUpdate = true;

// Определяем размеры текстуры
const textureWidth = nx;
const textureHeight = ny;
const textureDepth = nz;

// Определяем средние индексы срезов
let sliceX = Math.floor(nx / 2);
let sliceY = Math.floor(ny / 2);
let sliceZ = Math.floor(nz / 2);

// Создаем материалы
const materialX = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: {
        map: { value: texture },
        sliceX: { value: sliceX },
        textureHeight: { value: textureHeight },
        textureDepth: { value: textureDepth },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShaderX,
    side: THREE.DoubleSide,
});

const materialY = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: {
        map: { value: texture },
        sliceY: { value: sliceY },
        textureWidth: { value: textureWidth },
        textureDepth: { value: textureDepth },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShaderY,
    side: THREE.DoubleSide,
});

const materialZ = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: {
        map: { value: texture },
        sliceZ: { value: sliceZ },
        textureWidth: { value: textureWidth },
        textureHeight: { value: textureHeight },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShaderZ,
    side: THREE.DoubleSide,
});

// Плоскость по оси X
const planeX = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), materialX);
planeX.rotation.y = -Math.PI / 2;
planeX.position.x = sliceX / (nx - 1) - 0.5;

// Плоскость по оси Y
const planeY = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), materialY);
planeY.rotation.x = Math.PI / 2;
planeY.position.y = sliceY / (ny - 1) - 0.5;

// Плоскость по оси Z
const planeZ = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), materialZ);
planeZ.position.z = sliceZ / (nz - 1) - 0.5;

// Добавление плоскостей в сцену
scene.add(planeX);
scene.add(planeY);
scene.add(planeZ);

// Обработчик изменения размера окна
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Добавляем слушатель события изменения размера окна
window.addEventListener('resize', onWindowResize, false);

const gui = new dat.GUI();

const sliceParams = {
    sliceX: sliceX,
    sliceY: sliceY,
    sliceZ: sliceZ,
};

// Добавление контролов для срезов
gui.add(sliceParams, 'sliceX', 0, nx - 1, 1)
    .name('Slice X')
    .onChange((value) => {
        sliceX = value;
        materialX.uniforms.sliceX.value = value;
        planeX.position.x = value / (nx - 1) - 0.5;
        sliceX = value;
        texture.needsUpdate = true;
    });

gui.add(sliceParams, 'sliceY', 0, ny - 1, 1)
    .name('Slice Y')
    .onChange((value) => {
        sliceY = value;
        materialY.uniforms.sliceY.value = value;
        planeY.position.y = value / (ny - 1) - 0.5;
        sliceY = value;
        texture.needsUpdate = true;
    });

gui.add(sliceParams, 'sliceZ', 0, nz - 1, 1)
    .name('Slice Z')
    .onChange((value) => {
        sliceZ = value;
        materialZ.uniforms.sliceZ.value = value;
        planeZ.position.z = value / (nz - 1) - 0.5;
        sliceZ = value;
        texture.needsUpdate = true;
    });

// Анимационная функция
function animate() {
    requestAnimationFrame(animate);

    // Обновляем контролы
    controls.update();

    renderer.render(scene, camera);
}

// Запускаем анимацию
animate();
