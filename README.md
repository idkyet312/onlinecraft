# Babylon.js Voxel Demo

A small Minecraft-like voxel world built with Babylon.js. Features: first-person controls, block placing/breaking, simple biomes, procedural texture atlas, water (waves/refraction), trees, save/load, chunked meshing.

## Run locally

```powershell
npm install
# Start http server + websocket server in parallel
npm start
```
Then open http://127.0.0.1:5173 in your browser. For multiplayer, append `?ws=ws://localhost:8080` to the URL.

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

### Itch.io (HTML5)
- Zip your static files (at minimum `index.html`).
- Create a new itch project → kind: HTML5, upload the zip, and set it playable in the browser.
- Publish.

Multiplayer on itch requires an external WebSocket server (this repo’s `server.js`). Host it elsewhere and launch the itch URL with `?ws=wss://your-ws-host`. Browsers require `wss://` on HTTPS pages.
