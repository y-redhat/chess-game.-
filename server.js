
const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// public フォルダを静的配信
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket接続管理
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        // 他の全クライアントに送信
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
