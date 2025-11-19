//Tsかけない人は変化を加えたらaiにTsにしてもらってscript.tsの方にも変化を加える。
let selectedPiece = null;
let selectedSquare = null;
let piceClass = null; //新規追加　クラスごとの動きの追加
let currentPlayer = "white"; //現在のプレイヤー　白or黒

function changePiece(element) {
    const piece = element.innerHTML; // クリックされたマスの現在の駒
    const pieceColor = element.getAttribute('data-piece')?
        element.getAttribute('data-piece').split('-')[1]:null;//コマは何色?

    // 1. 駒が選択されていない場合
    if (selectedPiece === null) {
        // 駒のないマスをクリックした場合は何もしない
        if (piece === '') {
            return;
        }  //なんでだよー自分のやつ食われるやん

        if(piece !== currentPlayer){
            console.log("自分の駒以外選べない");
            return;
        }

        // 駒を選択状態にする
        selectedPiece = piece;
        selectedSquare = element;
        element.style.backgroundColor="#ff0000"
        // piceClass = 〇〇　htmlの方にid付与が必要 修正ポイント追加済
        // 選択されたマスにハイライトなどの視覚的な変化を適用（CSSファイルが必要）
        element.classList.add('selected');
        
        console.log(`駒を選択: ${selectedPiece} from ${element.id}`);

    // 2. 駒が選択されている場合 
    } else {
        // 選択中のマスを再度クリックした場合、選択解除する　このとき大きさなどを変えたい
        if (element === selectedSquare) {
            selectedSquare.classList.remove('selected');
            selectedPiece = null;
            selectedSquare = null;
            console.log("選択解除しました"); //コンソールをプレイヤーにみれるようにする必要ある　もしくは視覚的にわかりやすくしたい y-
            return;
        }

        //自分の駒を食う
        if (piece === currentPlayer){
            console.log("自分のものは食べられない")
            return;
        }

        // 相手の駒があるマスをクリックした場合
       // if (piece !== '') {
             // 実際には、駒の種類や色による複雑な判定が必要　重要
         //    console.log(`駒を取ります: ${piece} at ${element.id}`);
        //}
        
        // 選択された駒を新しいマスに配置 (innerHTMLの書き換え)
        element.innerHTML = selectedPiece; 
        
        if (selectedSquare) {
            selectedSquare.innerHTML = '';
            selectedSquare.classList.remove('selected');
            selectedSquare.style.backgroundColor = "#ffffff"; // 元のマスの背景色を戻す
        }

        console.log(`駒を移動: ${selectedPiece} to ${element.id}`);

        surrentPlayer = surrentPlayer === 'white' ? 'black':'white';
        console.log(`次のターンは: ${currentPlayer}`);
        // 選択状態をリセット
    
        selectedPiece = null;
        selectedSquare = null;
        
    }
}
//初期化ないけどなんか更新したら戻った(笑)
