// CONSTANS

var CANVAS_WIDTH = window.innerWidth;
var CANVAS_HEIGHT = window.innerHeight;

// var CANVAS_WIDTH = 800;
// var CANVAS_HEIGHT = 600;

var NANONAUT_WIDTH = 181;
var NANONAUT_HEIGHT = 229;

var GROUND_Y = 540;
var nanonautX = CANVAS_WIDTH - NANONAUT_WIDTH;

var NANONAUT_Y_ACCELERATION = 1;
var NANONAUT_X_SPEED = 5;
var NANONAUT_JUMP_SPEED = 20;
var NANONAUT_ANIMATION_SPEED = 3;

var BACKGROUND_WIDTH = 1000;

var W_KEY = 87;
var SPACE_KEY = 32;


var NANONAUT_NR_FRAMES_PER_ROW = 5;
var NANONAUT_NR_ANIMATION_FRAMES = 7;

// SETUP
var canvas = document.getElementById("coderdojo");
var c = canvas.getContext('2d');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

var nanonautImage = new Image();
nanonautImage.src = "assets/animatedNanonaut.png";

var backgroundImage = new Image();
backgroundImage.src = "assets/background.png"

var bush1Image = new Image();
bush1Image.src = "assets/bush1.png"

var nanonautX = 50;
var nanonautY = 40;
var nanonautYSpeed = 0;
var nanonautIsInTheAir = true;
var cameraX = 0;
var cameraY = 0;
var gameFrameCounter = 0;
var bushXCoordinates = [550,750,1000,1200]

var nanonautFrameNr = 0;

window.addEventListener("load", start);
window.addEventListener ("keydown", onKeyDown);
window.addEventListener ("keyup", onKeyUp);


var wIsPressed;
var spaceIsPressed;


function onKeyDown(event){
    currentKEY = event.keyCode;
    switch (currentKEY){
        case W_KEY:
            wIsPressed = true;
            break;
        case SPACE_KEY:
            spaceIsPressed = true;
            break;
    }
}

function onKeyUp(event){
    currentKEY = event.keyCode;
    switch (currentKEY){
        case W_KEY:
            wIsPressed = false;
            break;
        case SPACE_KEY:
            spaceIsPressed = false;
            break;
    }
}

function start(){
    window.requestAnimationFrame(mainloop);
}

// MAIN LOOP
function mainloop(){
    update();
    draw();
    window.requestAnimationFrame(mainloop);
}

// PLAYER INPUT


// UPDATING
function update(){
    gameFrameCounter += 1;
    nanonautX += NANONAUT_X_SPEED;
    if ((spaceIsPressed || wIsPressed) && !nanonautIsInTheAir){
        nanonautYSpeed = -NANONAUT_JUMP_SPEED;
        nanonautIsInTheAir = true;
    }

    nanonautY += nanonautYSpeed;
    nanonautYSpeed += NANONAUT_Y_ACCELERATION;

    if (nanonautY > (GROUND_Y - NANONAUT_HEIGHT)){
        nanonautY = GROUND_Y - NANONAUT_HEIGHT;
        nanonautYSpeed = 0;
        nanonautIsInTheAir = false;
    }

    // Update Animation
    if ((gameFrameCounter % NANONAUT_ANIMATION_SPEED) === 0){
        nanonautFrameNr += 1;
        if (nanonautFrameNr >= NANONAUT_NR_ANIMATION_FRAMES){
            nanonautFrameNr = 0;
        }
    }

    // Update camera
    cameraX = nanonautX-150

}

// DRAWING
function draw(){
    c.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    

    // Draw the sky
    c.fillStyle = "LightSkyBlue";
    c.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y - 40);

    // Draw the background
    var backgroundX = -(cameraX % BACKGROUND_WIDTH)-150;
    c.drawImage(backgroundImage, backgroundX, -210);
    c.drawImage(backgroundImage,  backgroundX + BACKGROUND_WIDTH, -210)
    c.drawImage(backgroundImage,  backgroundX + BACKGROUND_WIDTH + BACKGROUND_WIDTH, -210)

    // Draw the ground
    c.fillStyle = "forestGreen";
    c.fillRect(0, GROUND_Y-40, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y + 40);

    // Draw the bushes
    for (var i = 0; i < bushXCoordinates.length; i++){
        c.drawImage(bush1Image, bushXCoordinates[i] -cameraX, GROUND_Y - 100 - cameraY);
    }

    // Draw the Nanonaut.
    // c.drawImage(nanonautImage, nanonautX-cameraX, nanonautY-cameraY);
    var nanonautSpriteSheetRow = Math.floor(nanonautFrameNr/NANONAUT_NR_FRAMES_PER_ROW);
    var nanonautSpriteSheetColumn = nanonautFrameNr % NANONAUT_NR_FRAMES_PER_ROW;
    var nanonautSpriteSheetX = nanonautSpriteSheetColumn * NANONAUT_WIDTH;
    var nanonautSpriteSheetY = nanonautSpriteSheetRow * NANONAUT_HEIGHT;
    c.drawImage(nanonautImage, nanonautSpriteSheetX, nanonautSpriteSheetY,
        NANONAUT_WIDTH, NANONAUT_HEIGHT, nanonautX - cameraX, nanonautY - cameraY, 
        NANONAUT_WIDTH, NANONAUT_HEIGHT)

}