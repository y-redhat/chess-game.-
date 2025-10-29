########################
//定義
########################
 *****************************************/
$(function () {
    // マス目にイベントを設定する
    $(".square").click(clickSquareEvent);

    // 初期化ボタンを押したときのイベント
    $("#btn-initialize").click(initializeEvent);

    // 盤面を初期化する
    initializeEvent();
});

       





