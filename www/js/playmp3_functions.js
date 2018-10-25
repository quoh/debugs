/*
ノーツを生成し、グローバルのnotesに代入。
この関数内でノーツを生成する際のルール：startが早い順にソートされていること。
*/
function convertJsonToNotes(){
  let tile=null;
  requestAjaxJson("src/HERA.json",function(noteInfoJson){
    for (noteInfo of noteInfoJson) {
      let tile=tiles[noteInfo.tileNum%tiles.length];
      insertNote(parseInt(noteInfo.start),tile);
    }
  });

  //---------------------------------

  function insertNote(time,tile){
    let note={
      start:time,
      targetTile:tile,
      state:"wait"
    };
    if(tile!=null)notes.push(note);
  }
}

/*
引数tileに対する判定を実施、処理すべきノーツがあれば処理。
*/
function doJudgeOf(tile){
  for (note of notes) {
    if(note.targetTile.id==tile.id && note==tile.topNote){
      if(note.state=="white"){
        combo++;
        if(combo>peakCombo)peakCombo=combo;
        perfect++;
        score+=100;
        note.state="done";
        cordova.plugins.moto.setTileColor("off",note.targetTile.id,false,false);
      }else if(note.state=="red"){
        combo=0;
        miss++;
        note.state="done";
        cordova.plugins.moto.setTileColor("off",note.targetTile.id,false,false);
        setTimeout(function(){
          player.play();
        },1000);
      }
    }
  }
}

/*
ノーツ、タイル情報の更新。
*/
function stepNotesAndTiles(){
  let statechangingNotes=[];

  //stateの更新（statechangingNoteがあれば抽出）
  for (note of notes) {
    let pstate=note.state;
    if(note.state=="wait" && player.currentTime()*1000>=note.start-3000){
      note.state="blue";
    }else if(note.state=="blue" && player.currentTime()*1000>=note.start-2000){
      note.state="indigo";
    }else if(note.state=="indigo" && player.currentTime()*1000>=note.start-1000){
      note.state="violet";
    }else if(note.state=="violet" && player.currentTime()*1000>=note.start-500){
      note.state="white";
    }else if(note.state=="white" && player.currentTime()*1000>=note.start+500){
      note.state="red";
      player.pause();
    }

    if(note.state!=pstate){
      statechangingNotes.push(note);
    }
  }

  //tile.topNoteの更新
  for (tile of tiles) {
    tile.topNote=null;
  }
  for (note of notes) {
    if(note.targetTile.topNote==null && note.state!="wait" && note.state!="done"){
      note.targetTile.topNote=note;
    }
  }

  //statechangingNotesの中からtopNoteであるものに対して光らせるコマンドを実行する
  //これによって後続ノーツが続いて光ってプレイヤーを惑わせることがなくなる
  for (note of statechangingNotes) {
    if(note==note.targetTile.topNote){
      cordova.plugins.moto.setTileColor(note.state,note.targetTile.id,false,false);
    }
  }
}
