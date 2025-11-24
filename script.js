//フルスクリーン
document.getElementById("fullscreen-btn").addEventListener("click", () => {
    const fullscreenElement = document.getElementById("fullscreen");
    if (fullscreenElement.requestFullscreen) {
        fullscreenElement.requestFullscreen(); // フルスクリーンを開始
    } else if (fullscreenElement.webkitRequestFullscreen) { // Safari用
        fullscreenElement.webkitRequestFullscreen();
    } else if (fullscreenElement.msRequestFullscreen) { // IE/Edge用
        fullscreenElement.msRequestFullscreen();
    }
});



let selectedPiece = null;
let selectedSquare = null;
let currentPlayer = "white";
let myColor = null;
let roomId = null;

// WebSocket接続
const protocol = location.protocol === "https:" ? "wss" : "ws";
const socket = new WebSocket(`${protocol}://${window.location.host}`);

// サーバーからのメッセージ受信
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // 色 + ルーム割り当て
    if (data.type === "assign") {
        myColor = data.color;
        roomId = data.roomId;

        document.getElementById("player-info").innerText =
            `Room ${roomId} | You are ${myColor.toUpperCase()}`;

        currentPlayer = "white"; // 白から開始
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

function changePiece(element) {
    const piece = element.innerHTML;
    const pieceColor = element.getAttribute('data-piece') ? element.getAttribute('data-piece').split('-')[1] : null;

    // 自分の手番でなければ動かせない
    if (myColor !== currentPlayer) return;

    if (pieceColor !== currentPlayer && selectedPiece === null) return;

    if (!selectedPiece) {
        if (piece === '') return;
        selectedPiece = piece;
        selectedSquare = element;
        element.classList.add('selected');
        highlightMoves(selectedSquare);
        return;
    }

    if (element === selectedSquare) {
        selectedSquare.classList.remove('selected');
        selectedPiece = null;
        selectedSquare = null;
        clearHighlights();
        return;
    }

    if (!isValidMove(selectedSquare.id, element.id, selectedPiece)) {
        console.log('Invalid move!');
        return;
    }

    movePiece(selectedSquare, element);

    // 送信
    socket.send(JSON.stringify({
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
    toEl.setAttribute('data-piece', fromEl.getAttribute('data-piece'));
    fromEl.innerHTML = '';
    fromEl.removeAttribute('data-piece');
    fromEl.classList.remove('selected');
}

// ==== 駒のルール判定（簡易版） ====
function isValidMove(fromId, toId, piece) {
    const [fromRow, fromCol] = fromId.split('-').slice(1).map(Number);
    const [toRow, toCol] = toId.split('-').slice(1).map(Number);
    const pieceType = piece.split('-')[0];

    switch(pieceType) {
        case 'pwan':
            const dir = piece.includes('white') ? -1 : 1;
            if (fromCol === toCol && toRow === fromRow + dir) return true;
            break;

        case 'luke': // rook
            if (fromRow === toRow || fromCol === toCol) return true;
            break;

        case 'bishop':
            if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) return true;
            break;

        case 'queen':
            if (fromRow === toRow || fromCol === toCol ||
                Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) return true;
            break;

        case 'king':
            if (Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1) return true;
            break;

        case 'night':
            if ((Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) ||
                (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2)) return true;
            break;
    }
    return false;
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
}

// ==== ハイライト ====
function highlightMoves(squareEl) {
    const id = squareEl.id;
    const [row, col] = id.split('-').slice(1).map(Number);
    const moves = [
        [row+1, col], [row-1,col],[row,col+1],[row,col-1],
        [row+1,col+1],[row+1,col-1],[row-1,col+1],[row-1,col-1]
    ];
    moves.forEach(m => {
        const el = document.getElementById(`square-${m[0]}-${m[1]}`);
        if (el) el.classList.add('highlight');
    });
}

function clearHighlights() {
    document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
}
