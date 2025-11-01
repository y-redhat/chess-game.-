// 選択中の駒の情報を保持する変数
// null または string 型
let selectedPiece: string | null = null; 

// 選択中のマス（DOM要素）を保持する変数
// null または HTMLElement 型
let selectedSquare: HTMLElement | null = null; 

/**
 * マスのクリックイベントを処理し、駒の選択と移動を行う関数
 * @param element クリックされたHTML要素 (this)
 */
function changePiece(element: HTMLElement): void {
    // HTMLElementのinnerHTMLはstring型として取得される
    const piece: string = element.innerHTML; 

    // 1. 駒が選択されていない場合 (移動元を選択)
    if (selectedPiece === null) {
        // 駒のないマスをクリックした場合は何もしない
        if (piece === '') {
            return;
        }

        // 駒を選択状態にする
        selectedPiece = piece;
        selectedSquare = element;
        
        // 選択されたマスにハイライトなどの視覚的な変化を適用
        element.classList.add('selected');
        
        console.log(`駒を選択: ${selectedPiece} from ${element.id}`);

    // 2. 駒が選択されている場合 (移動先を選択)
    } else {
        // 選択中のマスを再度クリックした場合、選択解除する
        if (element === selectedSquare) {
            // selectedSquare が null でないことは if (selectedPiece !== null) で保証されている
            selectedSquare!.classList.remove('selected'); 
            selectedPiece = null;
            selectedSquare = null;
            console.log("選択解除しました");
            return;
        }
        
        // 選択中のマスと駒は確実に存在する (非nullアサーション演算子 '!' を使用)
        
        // 相手の駒があるマスをクリックした場合 (ここでは簡単な「取る」動作)
        if (piece !== '') {
             console.log(`駒を取ります: ${piece} at ${element.id}`);
        }
        
        // 選択された駒を新しいマスに配置 (innerHTMLの書き換え)
        element.innerHTML = selectedPiece; 
        
        // 元のマスを空にする
        selectedSquare!.innerHTML = ''; 
        
        // 選択状態をリセット
        selectedSquare!.classList.remove('selected');
        selectedPiece = null;
        selectedSquare = null;
        
        console.log(`駒を移動: ${selectedPiece} to ${element.id}`);
    }
}

