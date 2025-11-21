
let selectedPiece = null;
let selectedSquare = null;
let currentPlayer = "white";
let myColor = null;
let roomId = null;
let socket = null;

// ---- 画面操作 ----
document.getElementById("play-btn").addEventListener("click", () => {
    document.getElementById("home-screen").style.display = "none";
    document.getElementById("matching-screen").style.display = "block";
    connectWebSocket();
});

// ---- WebSocket 接続 ----
function connectWebSocket() {
    const protocol = location.protocol === "https:" ? "wss" : "ws";
    socket = new WebSocket(`${protocol}://${location.host}`);

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // 色と部屋割り当て
        if (data.type === "assign") {
            myColor = data.color;
            roomId = data.roomId;

            document.getElementById("matching-screen").style.display = "none";
            document.getElementById("game-screen").style.display = "block";

            document.getElementById("player-info").innerText =
                `Room ${roomId} | あなたは ${myColor.toUpperCase()}`;

            currentPlayer = "white";

            attachBoardEvents();
            return;
        }

        // 相手の指し手
        if (data.type === "move") {
            const fromEl = document.getElementById(data.from);
            const toEl = document.getElementById(data.to);
            movePiece(fromEl, toEl);
            switchPlayer();
        }
    };
}

// ---- 既存HTML盤のボタンへクリックを付与 ----
function attachBoardEvents() {
    document.querySelectorAll("#chessboard .chess-square").forEach(square => {
        square.addEventListener("click", () => changePiece(square));
    });
}

// ---- 駒移動処理 ----
function changePiece(element) {
    const piece = element.innerHTML;
    const pieceColor = element.getAttribute("data-piece")?.split("-")[1];

    if (myColor !== currentPlayer) return;

    if (!selectedPiece) {
        if (!piece) return;
        if (pieceColor !== currentPlayer) return;

        selectedPiece = piece;
        selectedSquare = element;
        element.classList.add("selected");
        highlightMoves(element);
        return;
    }

    if (selectedSquare === element) {
        selectedSquare.classList.remove("selected");
        selectedPiece = null;
        selectedSquare = null;
        clearHighlights();
        return;
    }

    if (!isValidMove(selectedSquare.id, element.id, selectedPiece)) return;

    movePiece(selectedSquare, element);

    // サーバーへ送信
    socket.send(JSON.stringify({
        type: "move",
        from: selectedSquare.id,
        to: element.id,
        piece: selectedPiece
    }));

    clearHighlights();
    switchPlayer();
    selectedPiece = null;
    selectedSquare = null;
}

function movePiece(fromEl, toEl) {
    toEl.innerHTML = fromEl.innerHTML;
    toEl.setAttribute("data-piece", fromEl.getAttribute("data-piece"));
    fromEl.innerHTML = "";
    fromEl.removeAttribute("data-piece");
    fromEl.classList.remove("selected");
}

// ---- 判定（簡易） ----
function isValidMove(fromId, toId, piece) {
    const [fr, fc] = fromId.split("-").slice(1).map(Number);
    const [tr, tc] = toId.split("-").slice(1).map(Number);
    const type = piece.split("-")[0];

    switch (type) {
        case "pwan":
            const dir = piece.includes("white") ? -1 : 1;
            return fc === tc && tr === fr + dir;

        case "luke":
            return fr === tr || fc === tc;

        case "bishop":
            return Math.abs(fr - tr) === Math.abs(fc - tc);

        case "queen":
            return fr === tr || fc === tc ||
                Math.abs(fr - tr) === Math.abs(fc - tc);

        case "king":
            return Math.abs(fr - tr) <= 1 && Math.abs(fc - tc) <= 1;

        case "night":
            return (Math.abs(fr - tr) === 2 && Math.abs(fc - tc) === 1) ||
                (Math.abs(fr - tr) === 1 && Math.abs(fc - tc) === 2);
    }
    return false;
}

function switchPlayer() {
    currentPlayer = currentPlayer === "white" ? "black" : "white";
}

// ---- ハイライト ----
function highlightMoves(squareEl) {
    const [r, c] = squareEl.id.split("-").slice(1).map(Number);
    const moves = [
        [r+1,c],[r-1,c],[r,c+1],[r,c-1],
        [r+1,c+1],[r+1,c-1],[r-1,c+1],[r-1,c-1]
    ];
    moves.forEach(([rr, cc]) => {
        const el = document.getElementById(`square-${rr}-${cc}`);
        if (el) el.classList.add("highlight");
    });
}

function clearHighlights() {
    document.querySelectorAll(".highlight").forEach(el => el.classList.remove("highlight"));
}
