
// ====== server.js ======
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, "public")));

// ======= ルーム管理 =======
let rooms = []; // { players: [ws1, ws2] }

function assignRoom(ws) {
    // 入れる部屋を探す（2人未満）
    let room = rooms.find(r => r.players.length < 2);

    // 無ければ新しい部屋
    if (!room) {
        room = { players: [] };
        rooms.push(room);
    }

    room.players.push(ws);
    ws.room = room;

    // 白黒割り当て
    const color = room.players.length === 1 ? "white" : "black";

    ws.send(JSON.stringify({
        type: "assign",
        color: color,
        roomId: rooms.indexOf(room) + 1
    }));
}

wss.on("connection", (ws) => {
    assignRoom(ws);

    ws.on("message", (msg) => {
        const data = JSON.parse(msg);
        const room = ws.room;

        // 相手だけに送る
        room.players.forEach(p => {
            if (p !== ws && p.readyState === WebSocket.OPEN) {
                p.send(JSON.stringify({
                    type: "move",
                    from: data.from,
                    to: data.to,
                    piece: data.piece
                }));
            }
        });
    });

    ws.on("close", () => {
        // ルームから削除
        const room = ws.room;
        if (!room) return;

        room.players = room.players.filter(p => p !== ws);

        // 全員いなければ部屋削除
        if (room.players.length === 0) {
            rooms = rooms.filter(r => r !== room);
        }
    });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
