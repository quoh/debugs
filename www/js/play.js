//---------------------------------------------------------

//制御部分

let songleWidget=null;
let position=0;

let tiles=[];
/*
tile={
id/int,
topNote/note
}
*/

let notes=[];
/*
note={
start/int,
targetTile/tile,
state/String
}
*/

//プレイデータ
let score=0;
let combo=0,peakCombo=0;
let perfect=0,miss=0;
let title,author;

//songleWidget準備
window.addEventListener("load",function(){

  let songleWidgetElement=SongleWidgetAPI.createSongleWidgetElement({
    api: "songle-widget-api-example",
    url: getParams()['url']
  });

  document.getElementById("widget").appendChild(songleWidgetElement);
});

//--

document.addEventListener("deviceready",function(){
  let useTileIds=JSON.parse(window.localStorage.getItem("useTileIds"));
  for (tileId of useTileIds) {
    let tile={
      id: tileId,
      topNote: null
    };
    tiles.push(tile);
  }

  cordova.plugins.moto.setAllTilesColor("off",false,false);
  cordova.plugins.moto.setAntPressEvent(function(tileId){
    //タイルを踏んだ際毎回判定を行う
    let tile=tiles.find(tile=>tile.id==tileId);
    if(tile!=undefined){
      doJudgeOf(tile);
    }
  },false);

  //--

  window.onSongleWidgetReady=function(_api,_songleWidget){
    songleWidget=_songleWidget;
    songleWidget.play();

    title=songleWidget.song.title;
    author=songleWidget.song.artist.name;

    generateNotes();

    //ループ
    setInterval(function(){
      if(songleWidget.position!=null)position=songleWidget.position;
      stepNotesAndTiles();
      if(songleWidget.position.milliseconds>=songleWidget.duration.milliseconds){
        moveToPlayResult();
      }
    },1);
  }
});

//---------------------------------------------------------

//view部分

let canvas;

function setup() {
  canvas=createCanvas(windowWidth*1,windowHeight*0.9);
  canvas.parent("field");
}

function draw() {
  background(0);
  fill(255); textSize(16); textAlign(CENTER);
  text("PERFECT - "+perfect,width*0.33,height*0.2);
  text("MISS - "+miss,width*0.66,height*0.2);
  text(combo+"  Combo",width*0.33,height*0.3);
  text(peakCombo+"  Peak Combo",width*0.66,height*0.3);
  text("Score  "+score,width*0.5,height*0.4);
}

function mousePressed(){
  songleWidget.play();
}
