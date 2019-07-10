let count;
let width;
let height;
let seed;
let nextx=2;
let nexty=2;
let countx = 0;
let county=0;
var pixels = ["#1111111"];

function start_app() {

  // size canvas to window
  sizeCanvas();

  //set up a ticker to refresh page automatically.
  let speed = 150; // how often screen refreshes, in milliseconds.
  let ticker = NOOPBOT_TICK_SETUP(draw, speed);

  //fire a draw event.
  draw();

  //redraw when canvas is clicked.
  canvas.addEventListener('click', draw);
}

function sizeCanvas() {
  appWidth = window.innerWidth;
  appHeight = window.innerHeight;
  canvas = document.getElementById('canvas');
  ctx = NOOPBOT_SETUP_CANVAS( { canvas: canvas, bgColor:'#ccccff' });
}



function draw() {
  //get the data!
  NOOPBOT_FETCH({
    API: 'hexbot',
    count: 1,
    width: appWidth,
    height: appHeight,
    seed: 'FFFFFF,000000',
  }, drawSet);
}

function drawSet(responseJson) {
  let { colors } = responseJson;
  colors.forEach(function(point) {
    drawPoint(ctx, point);
  })
}

function diff(n, m) {
  if (n <= m) {
    return (m - n);
    } else {
     return (n - m);
    }
}


function drawPoint(ctx, point) {
  //-----------basic
  //ctx.fillStyle = point.value;
  //----------------


  //--------------light pixels only
  //if (point.value > "#888888") {
  //  ctx.fillStyle = point.value;
  //  ctx.fillRect(nextx,nexty,10,10);
  //} else {
  //  ctx.fillStyle = "#FF0000";
  //}
  //  nextx=nextx+12;
  //  if (nextx>250) {
  //    nextx=2;
  //    nexty=nexty+12;
  //  }
  //---------------------


  //-------------------smooth picture, like a pixelated landscape
  if (countx==0 && county==0) {
    ctx.fillStyle = point.value;
    ctx.fillRect(nextx,nexty,10,10);  //make a small square
    nextx=nextx+12; // move position of next pixel
    countx += 1;
    pixels[countx,county] = point.value; //add the current pixel to the array
  }


  //  NOTE substr(1) removes the hash sign from the hex value
  //compare this pixel with the one to the left  OR  compare this pixel with the one above to ensure they are similar enough


  else if ((diff(parseInt(point.value.substr(1), 16), parseInt(pixels[countx,county].substr(1), 16)) < 3000000 )||(county>1 && diff(parseInt(point.value.substr(1), 16), parseInt(pixels[countx,county-1].substr(1), 16)) < 2000000)) {
    ctx.fillStyle = point.value;
    ctx.fillRect(nextx,nexty,10,10);
    nextx=nextx+12; // move position of next pixel
    countx += 1;
    if (countx==20) {  //end of a row so reset x and increase y
      countx=0;
      county +=1
      nextx = 2;
      nexty=nexty+12;
    }
    pixels[countx,county] = point.value; //add the current pixel to the array
  }
  if (county==20) {  // if the 20x20 picture has been made, wipe the canvas and start again. Could I capture the picture?
    sizeCanvas();
    county=0;
    nexty=2;
    countx = 0;
    nextx=2;

  }
  //-------------------------------------
}
