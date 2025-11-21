
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
    // まだ入れるルームがあるか？
    let room = rooms.find(r => r.players.length < 2);

    // もし空いてる部屋がないなら新しい部屋を作る
    if (!room) {
        room = { players: [] };
        rooms.push(room);
    }

    room.players.push(ws);
    ws.room = room;

    // プレイヤーの色を決定
    const color = room.players.length === 1 ? "white" : "black";

    ws.send(JSON.stringify({
        type: "assign_color",
        color: color,
        roomId: rooms.indexOf(room) + 1
    }));

    return room;
}

wss.on("connection", (ws) => {
    console.log("Client connected");

    // ルームに自動配置
    const room = assignRoom(ws);

    ws.on("message", (msg) => {
        // 同じルームの相手にだけ送る
        room.players.forEach(player => {
            if (player !== ws && player.readyState === WebSocket.OPEN) {
                player.send(msg);
            }
        });
    });

    ws.on("close", () => {
        // ルームから削除
        room.players = room.players.filter(p => p !== ws);

        // 空のルームは削除
        if (room.players.length === 0) {
            rooms = rooms.filter(r => r !== room);
        }
    });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

