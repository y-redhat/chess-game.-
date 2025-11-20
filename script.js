

let selectedPiece = null;
let selectedSquare = null;
let currentPlayer = "white";

// WebSocket接続
const socket = new WebSocket(`ws://${window.location.host}`);

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const fromEl = document.getElementById(data.from);
    const toEl = document.getElementById(data.to);
    movePiece(fromEl, toEl);
    switchPlayer();
};

function changePiece(element) {
    const piece = element.innerHTML;
    const pieceColor = element.getAttribute('data-piece') ? element.getAttribute('data-piece').split('-')[1] : null;

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
    clearHighlights();

    // サーバー経由で相手に同期
    socket.send(JSON.stringify({
        from: selectedSquare.id,
        to: element.id,
        piece: selectedPiece
    }));

    switchPlayer();
    selectedPiece = null;
    selectedSquare = null;
}

// 駒を移動
function movePiece(fromEl, toEl) {
    toEl.innerHTML = fromEl.innerHTML;
    toEl.setAttribute('data-piece', fromEl.getAttribute('data-piece'));
    fromEl.innerHTML = '';
    fromEl.removeAttribute('data-piece');
    fromEl.classList.remove('selected');
}

// 駒ルールチェック（簡略版）
function isValidMove(fromId, toId, piece) {
    const [fromRow, fromCol] = fromId.split('-').slice(1).map(Number);
    const [toRow, toCol] = toId.split('-').map(Number);
    const pieceType = piece.split('-')[0];

    switch(pieceType) {
        case 'pwan':
            const dir = piece.includes('white') ? -1 : 1;
            if (fromCol === toCol && toRow === fromRow + dir) return true;
            break;
        case 'luke':
            if (fromRow === toRow || fromCol === toCol) return true;
            break;
        case 'bishop':
            if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) return true;
            break;
        case 'queen':
            if (fromRow === toRow || fromCol === toCol || Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) return true;
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
    console.log('Next player: ' + currentPlayer);
}

// ハイライト
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
        
