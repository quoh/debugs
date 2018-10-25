let canvas;
let score,perfect,miss,peakCombo,title,author;
let accuracy;

function setup() {
  canvas=createCanvas(windowWidth*1,windowHeight*1);
  canvas.parent("field");

  score=getParams()['score'];
  perfect=parseInt(getParams()['perfect']);
  miss=parseInt(getParams()['miss']);
  peakCombo=getParams()['peakCombo'];
  title=getParams()['title'];
  author=getParams()['author'];

  if(perfect+miss>0) accuracy=(perfect/(perfect+miss)*100).toFixed(1);
  else accuracy=0;
}

function draw() {
  background(255);

  fill(0); textSize(16); textAlign(CENTER);
  text(title,width*0.5,height*0.1);
  text(author,width*0.5,height*0.15);

  stroke(0); strokeWeight(1);
  line(0,height*0.3,width,height*0.3);

  fill(100); noStroke();
  rectMode(CENTER);
  rect(width*0.5,height*0.3,height*0.2,height*0.2);

  fill(0); textSize(16); textAlign(CENTER);
  text("Score  "+score,width*0.33,height*0.5);
  text("PERFECT - "+perfect,width*0.33,height*0.55);
  text("MISS - "+miss,width*0.33,height*0.6);
  text(peakCombo+" Peak Combo.",width*0.33,height*0.65);

  fill(0); textSize(32); textAlign(CENTER);
  text(accuracy+"%",width*0.66,height*0.575);
}
