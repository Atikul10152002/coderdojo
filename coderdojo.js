// CONSTANS

var FULLSCREEN = false

if (FULLSCREEN === true){
    var CANVAS_WIDTH = window.innerWidth
    var CANVAS_HEIGHT = window.innerHeight
} else{
    var CANVAS_WIDTH = 800
    var CANVAS_HEIGHT = 600
}

var NANONAUT_WIDTH = 181
var NANONAUT_HEIGHT = 229

var GROUND_Y = 540
var nanonautX = CANVAS_WIDTH - NANONAUT_WIDTH

var NANONAUT_Y_ACCELERATION = 1
var NANONAUT_X_SPEED = 5
var NANONAUT_JUMP_SPEED = 20
var NANONAUT_ANIMATION_SPEED = 3

var ROBOT_HEIGHT = 139
var ROBOT_WIDTH = 141
var ROBOT_X_SPEED = 4

var BACKGROUND_WIDTH = 1000

var W_KEY = 87
var SPACE_KEY = 32

var NANONAUT_NR_ANIMATION_FRAMES = 7
var ROBOT_ANIMATION_SPEED = 5
var ROBOT_NR_ANIMATION_FRAMES = 9

if (FULLSCREEN === true){
    var MIN_DISTANCE_BETWEEN_ROBOTS = nanonautX 
} else{
    var MIN_DISTANCE_BETWEEN_ROBOTS = nanonautX *2 
}

console.log(nanonautX)
var MAX_DISTANCE_BETWEEN_ROBOTS = CANVAS_WIDTH
var MAX_ACTIVE_ROBOTS = 3

// SETUP

// Setting up Canvas
var canvas = document.getElementById("coderdojo")
var c = canvas.getContext('2d')

canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT

// Loading Images
var nanonautImage = new Image()
nanonautImage.src = "assets/animatedNanonaut.png"

var backgroundImage = new Image()
backgroundImage.src = "assets/background.png"

var bush1Image = new Image()
bush1Image.src = "assets/bush1.png"

var bush2Image = new Image()
bush2Image.src = "assets/bush2.png"

var robotImage = new Image()
robotImage.src = 'assets/animatedRobot.png'

// spriteSheet properties
var robotSpritesheet = {
    nrFramesPerRow: 3,
    spriteWidth: ROBOT_WIDTH,
    spriteHeight: ROBOT_HEIGHT,
    image: robotImage
}

var robotData = []

// var robotData = [{
//     x: 400,
//     y: GROUND_Y - ROBOT_HEIGHT,
//     frameNr: 0
// }]

var nanonautSpriteSheet = {
    nrFramesPerRow: 5,
    spriteWidth: NANONAUT_WIDTH,
    spriteHeight: NANONAUT_HEIGHT,
    image: nanonautImage
}


// Global Varibles
var nanonautIsInTheAir = true
var gameFrameCounter = 0
var nanonautFrameNr = 0
var nanonautYSpeed = 0
var nanonautX = 50
var nanonautY = 40
var cameraX = 0
var cameraY = 0

var wIsPressed
var spaceIsPressed

var bushData = generateBush()

// collision rectangle
var nanonautCollisionRectangle = {
    xOffset: 60,
    yOffset: 20,
    width: 50,
    height: 200
}

var robotCollsionRectangle = {
    xOffset: 50,
    yOffset: 20,
    width: 50,
    height: 100
}


// event listeners
window.addEventListener("keydown", onKeyDown)
window.addEventListener("keyup", onKeyUp)
window.addEventListener("load", start)

// Handles KeyDown event
function onKeyDown(event) {
    currentKEY = event.keyCode
    switch (currentKEY) {
        case SPACE_KEY:
            spaceIsPressed = true
            break
        case W_KEY:
            wIsPressed = true
            break
    }
}

// Handles KeyUp event
function onKeyUp(event) {
    currentKEY = event.keyCode
    switch (currentKEY) {
        case SPACE_KEY:
            spaceIsPressed = false
            break
        case W_KEY:
            wIsPressed = false
            break
    }
}
// Starts the mainloop
function start() {
    window.requestAnimationFrame(mainloop)
}

// Functions for random functionality
function randint(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length)
    return choices[index]
}

// generates array of properties for the bushes
function generateBush() {
    var generatedBushData = []
    for (var i = 0; i < 10; i++) {
        generatedBushData.push({
            image: choose([bush1Image, bush2Image]),
            x: randint(-900, CANVAS_WIDTH * 1.5),
            y: randint(90, 100)
        })
    }
    return generatedBushData
}

// MAIN LOOP
function mainloop() {
    update()
    draw()
    window.requestAnimationFrame(mainloop)
}

// PLAYER INPUT


// UPDATING
function update() {
    // Jump action
    gameFrameCounter += 1
    nanonautX += NANONAUT_X_SPEED
    if ((spaceIsPressed || wIsPressed) && !nanonautIsInTheAir) {
        nanonautYSpeed = -NANONAUT_JUMP_SPEED
        nanonautIsInTheAir = true
    }

    nanonautY += nanonautYSpeed
    nanonautYSpeed += NANONAUT_Y_ACCELERATION

    // stops infinite jumpus
    if (nanonautY > (GROUND_Y - NANONAUT_HEIGHT)) {
        nanonautY = GROUND_Y - NANONAUT_HEIGHT
        nanonautYSpeed = 0
        nanonautIsInTheAir = false
    }

    // Update Animation
    if ((gameFrameCounter % NANONAUT_ANIMATION_SPEED) === 0) {
        nanonautFrameNr += 1
        if (nanonautFrameNr >= NANONAUT_NR_ANIMATION_FRAMES) {
            nanonautFrameNr = 0
        }
    }

    // Updates camera
    cameraX = nanonautX - 150

    // updates bushes
    for (var i = 0; i < bushData.length; i++) {
        if ((bushData[i].x - cameraX) < (-CANVAS_WIDTH)) {
            bushData[i].x += (CANVAS_WIDTH * 2) + 150
        }
    }

    // Update Robots
    updateRobots()
}

function updateRobots(){
    // Move and animate robots.
    for (var i = 0; i< robotData.length; i++){
        if (doesNanonautOverlapRobot (
            nanonautX + nanonautCollisionRectangle.xOffset,
            nanonautY + nanonautCollisionRectangle.yOffset,
            nanonautCollisionRectangle.width,
            nanonautCollisionRectangle.height,
            robotData[i].x + robotCollsionRectangle.xOffset,
            robotData[i].y = robotCollsionRectangle.yOffset,
            robotCollsionRectangle.width,
            robotCollsionRectangle.height
        )){
            console.log("OUCH!")
        }

        robotData[i].x -= ROBOT_X_SPEED
        if ((gameFrameCounter % ROBOT_ANIMATION_SPEED) === 0){
            robotData[i].frameNr += 1
            if (robotData[i].frameNr >= ROBOT_NR_ANIMATION_FRAMES){
                robotData[0].frameNr = 0
            }
        }
    }

    // Remove robots htat have gone off-screen
    var robotIndex = 0
    while (robotIndex < robotData.length){
        if (robotData[robotIndex].x < cameraX - ROBOT_WIDTH){
            robotData.splice(robotIndex, 1)
            console.log("Robot removed!")
        } else {
            robotIndex += 1
        }
    }

    if (robotData.length < MAX_ACTIVE_ROBOTS){
        var lastRobotX = CANVAS_WIDTH
        if (robotData.length > 0){
            var lastRobotX = robotData[robotData.length -1].x }
        var newRobotX = lastRobotX + MIN_DISTANCE_BETWEEN_ROBOTS + Math.random() * 
        (MAX_DISTANCE_BETWEEN_ROBOTS - MIN_DISTANCE_BETWEEN_ROBOTS)
        robotData.push({
            x: newRobotX,
            y: GROUND_Y - ROBOT_HEIGHT,
            frameNr: 0
        })
    }
}

function doesNanonautOverlapRobotAlongOneAxis(nanonautNearX, nanonautFarX, robotNearX, robotFarX){
    var nanonautOverlapsNearRobotEdge = (nanonautFarX >= robotNearX) && (nanonautFarX <= robotFarX)
    var nanonautOverlapsFarRobotEdge = (nanonautNearX >= robotNearX) && (nanonautNearX <= robotFarX)
    var nanonautOverlapsEntireRobot = (nanonautNearX <= robotNearX) && (nanonautFarX >= robotFarX)

    return nanonautOverlapsEntireRobot || nanonautOverlapsFarRobotEdge || nanonautOverlapsNearRobotEdge
}

function doesNanonautOverlapRobot(nanonautX, nanonautY, nanonautWidth, nanonautHeight, robotX, robotY, robotWidth, robotHeight){
    var nanonautOverlapsRobotOnXAxis = doesNanonautOverlapRobotAlongOneAxis(
        nanonautX, 
        nanonautX + nanonautWidth,
        robotX,
        robotX + robotWidth
    )
    var nanonautOverlapsRobotOnYAxis = doesNanonautOverlapRobotAlongOneAxis(
        nanonautY, 
        nanonautY + nanonautHeight,
        robotY,
        robotY + robotHeight
    )
    return nanonautOverlapsRobotOnXAxis && nanonautOverlapsRobotOnYAxis
}

// DRAWING
function draw() {
    // Clear Screen
    c.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Spritesheet function
    function drawAnimatedSprite(screenX, screenY, frameNr, spriteSheet) {
        var spriteSheetRow = Math.floor(frameNr / spriteSheet.nrFramesPerRow)
        var spriteSheetColumn = frameNr % spriteSheet.nrFramesPerRow
        var spriteSheetX = spriteSheetColumn * spriteSheet.spriteWidth
        var spriteSheetY = spriteSheetRow * spriteSheet.spriteHeight
        c.drawImage(
            spriteSheet.image,
            spriteSheetX, spriteSheetY,
            spriteSheet.spriteWidth,
            spriteSheet.spriteHeight,
            screenX, screenY,
            spriteSheet.spriteWidth,
            spriteSheet.spriteHeight)
    }

    // Draw the sky
    c.fillStyle = "LightSkyBlue"
    c.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y - 40)

    // Draw the background
    var backgroundX = -(cameraX % BACKGROUND_WIDTH) - 150
    c.drawImage(backgroundImage, backgroundX, -210)
    c.drawImage(backgroundImage, backgroundX + BACKGROUND_WIDTH, -210)
    if (FULLSCREEN === true){
        c.drawImage(backgroundImage, backgroundX + BACKGROUND_WIDTH + BACKGROUND_WIDTH, -210)
    }
    
    

    // Draw the ground
    c.fillStyle = "forestGreen"
    c.fillRect(0, GROUND_Y - 40, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y + 40)

    // Draw the bushes
    for (var i = 0; i < bushData.length; i++) {
        c.drawImage(bushData[i].image, bushData[i].x - cameraX, GROUND_Y - bushData[i].y - cameraY)
    }

    // Draw the robots
    for (var i=0; i< robotData.length; i++){
        drawAnimatedSprite(robotData[i].x - cameraX,
        robotData[i].y - cameraY, robotData[i].frameNr, robotSpritesheet)
    }

    // Draw the Nanonaut
    drawAnimatedSprite(nanonautX-cameraX, nanonautY-cameraY,
    nanonautFrameNr, nanonautSpriteSheet)

}

// CREDITS
console.log(
    "     NANONAUT PROJECT CRATED BY - MOHAMMAD ISLAM \n\
            Create using CoderDojo <NAND>\n\
                Create with <CODE>\n\n\
                MAKE YOUR OWN GAME\n\
---------------------------------------------------------\n\
          Sprites and gameidea by CoderDojo")