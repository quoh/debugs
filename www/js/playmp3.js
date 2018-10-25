let tiles = [];
/*
tile={
id/int,
topNote/note
}
*/

let notes = [];
/*
note={
start/int,
targetTile/tile,
state/String
}
*/

//プレイデータ
let score = 0;
let combo = 0, peakCombo = 0;
let perfect = 0, miss = 0;

let canvas;
let player;

//--

document.addEventListener("deviceready", function () {
  let useTileIds = JSON.parse(window.localStorage.getItem("useTileIds"));
  for (tileId of useTileIds) {
    let tile = {
      id: tileId,
      topNote: null
    };
    tiles.push(tile);
  }

  // cordova.plugins.moto.setAllTilesColor("off", false, false);
  // cordova.plugins.moto.setAntPressEvent(function (tileId) {
  //   //タイルを踏んだ際毎回判定を行う
  //   let tile = tiles.find(tile => tile.id == tileId);
  //   if (tile != undefined) {
  //     doJudgeOf(tile);
  //   }
  // }, false);
});


//--

function preload() {
  soundFormats('mp3');
  player = loadSound('src/HERA.mp3');
}

function setup() {
  canvas = createCanvas(windowWidth * 1, windowHeight * 0.9);
  canvas.parent("field");

  convertJsonToNotes();
  console.log(notes);

  player.play();
}

function draw() {
  stepNotesAndTiles();
  viewTiles();

  background(0);
  fill(255); textSize(16); textAlign(CENTER);
  text("PERFECT - " + perfect, width * 0.33, height * 0.2);
  text("MISS - " + miss, width * 0.66, height * 0.2);
  text(combo + "  Combo", width * 0.33, height * 0.3);
  text(peakCombo + "  Peak Combo", width * 0.66, height * 0.3);
  text("Score  " + score, width * 0.5, height * 0.4);
}

function mousePressed() {
  console.log(notes);
}

function keyPressed() {
  let tile;
  switch (key) {
    case 'a':
    tile = 0;
    case 's':
    tile = 1;
    case 'd':
    tile = 2;
    case 'f':
    tile = 3;
    default :
    tile = null;
  }
  if (tile != undefined) {
    doJudgeOf(tile);
  }
}
function viewTiles() {

}