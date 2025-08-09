// Minimal multiplayer server using WebSocket
// Keeps player transforms and block edits in memory and broadcasts updates.

const http = require('http');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 8080;

// Create a small HTTP server so health checks and direct visits work (helps cloudflared avoid 502)
const server = http.createServer((req, res) => {
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' });
    res.end('WS OK\n');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const wss = new WebSocketServer({ server });

// In-memory state
const players = new Map(); // id -> { name, x,y,z, rx,ry }
const worldEdits = new Map(); // 'x|y|z' -> t (0 means removed)

function send(ws, msg){
  try { ws.send(JSON.stringify(msg)); } catch { /* ignore */ }
}
function broadcast(msg, except){
  const data = JSON.stringify(msg);
  for (const client of wss.clients){
    if (client.readyState === 1 /* OPEN */ && client !== except){
      try { client.send(data); } catch { /* ignore */ }
    }
  }
}
function genId(){ return Math.random().toString(36).slice(2, 10); }

wss.on('connection', (ws) => {
  const id = genId();
  players.set(id, { name: `p_${id.slice(0,4)}`, x:0,y:0,z:0, rx:0,ry:0 });
  send(ws, { type:'welcome', id });

  ws.on('message', (data) => {
    let msg; try { msg = JSON.parse(data.toString()); } catch { return; }
    if (!msg || typeof msg !== 'object') return;

    switch(msg.type){
      case 'hello': {
        const p = players.get(id); if (!p) return;
        if (typeof msg.name === 'string') p.name = msg.name.slice(0,24);
        // Send current world edits snapshot
        if (worldEdits.size){
          const arr = [];
          worldEdits.forEach((t, k) => {
            const [xs,ys,zs] = k.split('|').map(Number);
            arr.push([xs,ys,zs,t]);
          });
          send(ws, { type:'world', vox: arr });
        }
        break;
      }
      case 'pos': {
        // { x,y,z, rx, ry }
        const p = players.get(id); if (!p) return;
        if (typeof msg.x === 'number') { p.x = msg.x; p.y = msg.y; p.z = msg.z; }
        if (typeof msg.rx === 'number') { p.rx = msg.rx; p.ry = msg.ry; }
        broadcast({ type:'pos', id, x:p.x, y:p.y, z:p.z, rx:p.rx, ry:p.ry }, ws);
        break;
      }
      case 'block': {
        // { x,y,z,t }
        const x = msg.x|0, y = msg.y|0, z = msg.z|0;
        const t = msg.t|0; // 0=remove, >0=type
        const k = `${x}|${y}|${z}`;
        if (t) worldEdits.set(k, t); else worldEdits.set(k, 0);
        broadcast({ type:'block', id, x, y, z, t });
        break;
      }
      case 'requestWorld': {
        if (worldEdits.size){
          const arr = [];
          worldEdits.forEach((t, k) => {
            const [xs,ys,zs] = k.split('|').map(Number);
            arr.push([xs,ys,zs,t]);
          });
          send(ws, { type:'world', vox: arr });
        } else {
          send(ws, { type:'world', vox: [] });
        }
        break;
      }
    }
  });

  ws.on('close', () => {
    players.delete(id);
    broadcast({ type:'leave', id });
  });
});

server.listen(PORT, () => {
  console.log(`[ws] Multiplayer server listening on ws://localhost:${PORT}`);
});
