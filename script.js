//初期化
$(function(){
     initializeBoard();
        $(".square").click(clickSquareEvent);
});

const initializeBoard = () =>{
    const　縮図 = [ 
        "r", "n", "b", "q", "k", "b", "n", "r", // 黒の駒
        "p", "p", "p", "p", "p", "p", "p", "p", // 黒のポーン
        "", "", "", "", "", "", "", "",         // 空のマス
        "", "", "", "", "", "", "", "",         // 空のマス
        "", "", "", "", "", "", "", "",         // 空のマス
        "", "", "", "", "", "", "", "",         // 空のマス
        "P", "P", "P", "P", "P", "P", "P", "P", // 白のポーン
        "R", "N", "B", "Q", "K", "B", "N", "R"  // 白の駒
        ];
}







########################
//定義
########################
 *****************************************/
$(function () {
    // マス目にイベントを設定する
    $(".square").click(clickSquareEvent);
});
   function clickSquareEvent(){
       let square = $(this)
       putPiece(square."black");
   }




