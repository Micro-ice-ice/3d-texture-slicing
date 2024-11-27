# 3D Texture Slicing Visualization

This project demonstrates the slicing of 3D textures using **Three.js**. The 3D texture is visualized by rendering orthogonal slices along the X, Y, and Z axes, allowing users to explore its internal structure interactively.

---

## How It Works

1. **3D Texture**: 
   - The texture is represented as a `THREE.Data3DTexture` object, storing voxel data in a 3D grid (RGBA format).
   - The texture values can represent gradients, noise, or any user-defined data.

2. **Slice Rendering**:
   - Slices along the X, Y, and Z axes are displayed as planes.
   - Custom GLSL fragment shaders are used to sample the texture and render the corresponding slice.

3. **Interactive Slicing**:
   - The slice index for each axis can be dynamically adjusted, enabling exploration of different layers of the texture.

---

## Live demonstration

https://micro-ice-ice.github.io/3d-texture-slicing/

