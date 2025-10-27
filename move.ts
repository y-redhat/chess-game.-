// script.js
const board = document.getElementById('chess-board');

// チェスボードの初期化
function initializeBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            board.appendChild(square);
        }
    }
}

// ゲームの初期化
initializeBoard();

//ポーンの動きと定位置//
