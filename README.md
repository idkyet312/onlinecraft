# Babylon.js Voxel Demo

A small Minecraft-like voxel world built with Babylon.js. Features: first-person controls, block placing/breaking, simple biomes, procedural texture atlas, water (waves/refraction), trees, save/load, chunked meshing.

## Run locally

```powershell
npm install
npm run start
```
Then open http://127.0.0.1:5173 in your browser.

## Controls
- W/A/S/D: Move
- Mouse: Look (click to lock)
- Shift: Sprint
- Space: Jump (physics-based)
- F: Toggle fly
- P: Respawn to surface
- Left click: Break block
- Right click: Place block
- 1–7: Select block type (Grass, Dirt, Stone, Sand, Snow, Wood, Leaves)
- K: Save, L: Load, C: Clear Save

## Notes
- For performance, the world is chunked and meshed per chunk. You can expand SIZE_X/SIZE_Z and CHUNK_SIZE.
- Textures are procedurally generated via a DynamicTexture. Replace with real textures if desired.

## Deploy
Any static host works (GitHub Pages, Netlify, Vercel). Build step not required since this is static HTML.
