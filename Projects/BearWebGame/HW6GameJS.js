
//let canvas = document.getElementsByTagName("canvas")[0];
let canvas = document.getElementById("canvasDrawing");
let context = canvas.getContext("2d");
let canvasW = canvas.width;
let canvasH = canvas.height;

let RunGuy= new Image();
RunGuy.src = "img/baby2.png";

// let Bear = new Image();
// Bear.src = "img/bear2.png";

let bearArray = [];
for (let i = 0; i < 3; i++){
  let bearObj = {}
  bearObj.img = new Image();
  bearObj.img.src = "img/bear2.png";
  bearObj.xPos = Math.floor(Math.random() * 1000)
  bearObj.yPos = Math.floor(Math.random() * 600)
  bearArray.push(bearObj);
}

let killed = false;

function animateImage() {

  eraseOld();

  context.drawImage(RunGuy, RunGuy.xPos - 60, RunGuy.yPos - 25, 90, 50);

  //bear following mouse
  for (let i = 0; i < bearArray.length; i++) {
    context.drawImage(bearArray[i].img, bearArray[i].xPos, bearArray[i].yPos, 150, 100);

    if (RunGuy.xPos > bearArray[i].xPos) {
      bearArray[i].xPos += 5;
    } else if (RunGuy.xPos < bearArray[i].xPos) {
      bearArray[i].xPos -= 5;
    }

    if (RunGuy.yPos > bearArray[i].yPos) {
      bearArray[i].yPos += 5;
    } else if (RunGuy.yPos < bearArray[i].yPos) {
      bearArray[i].yPos -= 5;
    }

    if (bearArray[i].xPos > canvasW) {
      bearArray[i].xPos -= 100;
    } else if (bearArray[i].xPos < 0) {
      bearArray[i].xPos += 100;
    }

    //if guy is touched - end timer
    if (Math.abs((bearArray[i].xPos)- RunGuy.xPos) < 5
      && Math.abs((bearArray[i].yPos)+ - RunGuy.yPos) < 5) {
      console.log("kill");
      killed = true;
      clearInterval(Timer);
    }

    //checking for bear v bear collision
    for (let j = 0; j < bearArray.length; j++) {
      if (bearArray[i] !== bearArray[j]) {
        if (Math.abs((bearArray[i].xPos + 100) - (bearArray[j].xPos + 100)) < 30
          && Math.abs((bearArray[i].yPos + 100) - (bearArray[j].yPos + 100)) < 30) {
          bearArray[j].xPos = Math.random() * 400;
          bearArray[j].yPos = Math.random() * 200;
          console.log("collision")
        }
      }
    }
  }

  if (!killed) {
  window.requestAnimationFrame(animateImage);
}
  else{
    gameOver();
  }

}

function gameOver(){
  context.font = "50px Ariel";
  context.fillStyle = "red";
  context.fillText("YOU DIED", 400 , 300);
}

function mainDrawing(){
  window.requestAnimationFrame(animateImage);
}

function handleMouse(e){
  RunGuy.xPos = e.x;
  RunGuy.yPos = e.y;

  //rotate
  // for (let i = 0; i < bearArray.length; i++) {
  //   let BX = bearArray[i].offsetLeft + bearArray[i].offsetWidth/2;
  //   let BY = bearArray[i].offsetTop + bearArray[i].offsetHeight/2;
  //   let nX = BX - event.clientX;
  //   let nY = BX - event.clientY;
  //   let degree = (Math.atan(-nX/nY)*180)/Math.PI;
  //   if(dY > 0){
  //     degree += 180;
  //   }
  //   bearArray[i].style.transform = "rotate(" + degree + "deg)";
  // }

}

function eraseOld(){
  //add layer on top of previous image
  context.fillStyle=("rgb(100, 100 100)");
  context.fillRect(0,0, canvasW, canvasH);
}

//TIMER:
let Timer = setInterval(countTimer, 1000);
let totalSeconds = 0;
function countTimer() {
  totalSeconds++;
  let hour = Math.floor(totalSeconds /3600);
  let minute = Math.floor((totalSeconds - hour*3600)/60);
  let seconds = totalSeconds - (hour*3600 + minute*60);
  if(hour < 10)
    hour = "0"+hour;
  if(minute < 10)
    minute = "0"+minute;
  if(seconds < 10)
    seconds = "0"+seconds;
  document.getElementById("timer").innerHTML = hour + ":" + minute + ":" + seconds;
}


window.onload=mainDrawing;

document.onmousemove = handleMouse;


//change background
// window.setInterval(changeBackground, 200);
// function changeBackground(){
//
//   let doc = document.getElementById("canvasDrawing");
//   let color = ["rgb(200, 200, 0)", "rgb(100, 0, 100)", "rgb(0, 150, 0)"];
//   doc.style.backgroundColor = color[i];
//   i = (i + 1) % color.length;
//
// }
