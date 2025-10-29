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




