// CONSTANS
var FULLSCREEN = true

if (FULLSCREEN) {
    var CANVAS_WIDTH = window.innerWidth - 15
    var CANVAS_HEIGHT = window.innerHeight - 20
} else {
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
var NANONAUT_MAX_HEALTH = 100

var ROBOT_HEIGHT = 139
var ROBOT_WIDTH = 141
var ROBOT_X_SPEED = 4

var BACKGROUND_WIDTH = 1000

var W_KEY = 87
var SPACE_KEY = 32

var NANONAUT_NR_ANIMATION_FRAMES = 7
var ROBOT_ANIMATION_SPEED = 5
var ROBOT_NR_ANIMATION_FRAMES = 9

var SCREENSHAKE_RADIUS = 30

var PLAY_GAME_MODE = 0
var GAME_OVER_GAME_MODE = 1

if (FULLSCREEN) {
    var MIN_DISTANCE_BETWEEN_ROBOTS = nanonautX
} else {
    var MIN_DISTANCE_BETWEEN_ROBOTS = nanonautX * 2
}

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
nanonautImage.src = "compressed_assets/animatedNanonaut.png"

var backgroundImage = new Image()
backgroundImage.src = "compressed_assets/background.png"

var bush1Image = new Image()
bush1Image.src = "compressed_assets/bush1.png"

var bush2Image = new Image()
bush2Image.src = "compressed_assets/bush2.png"

var robotImage = new Image()
robotImage.src = 'compressed_assets/animatedRobot.png'

// spriteSheet properties
var robotSpritesheet = {
    nrFramesPerRow: 3,
    spriteWidth: ROBOT_WIDTH,
    spriteHeight: ROBOT_HEIGHT,
    image: robotImage
}

// empty array to store the robot index
var robotData = []

var robotData = [{
    x: 400,
    y: GROUND_Y - ROBOT_HEIGHT,
    frameNr: 0
}]

var nanonautSpriteSheet = {
    nrFramesPerRow: 5,
    spriteWidth: NANONAUT_WIDTH,
    spriteHeight: NANONAUT_HEIGHT,
    image: nanonautImage
}

// Global Varibles
var gameMode = PLAY_GAME_MODE

var nanonautIsInTheAir = true
var gameFrameCounter = 0
var nanonautFrameNr = 0
var nanonautYSpeed = 0
var nanonautX = 50
var nanonautY = 40
var cameraX = 0
var cameraY = 0

var nanonautHealth = NANONAUT_MAX_HEALTH

var wIsPressed
var spaceIsPressed

var screenshake = false

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
    if (gameMode != PLAY_GAME_MODE)
        return;

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
    screenshake = false
    var nanonautTouchedARobot = updateRobots()
    if (nanonautTouchedARobot) {
        screenshake = true
        if (nanonautHealth > 0) {
            nanonautHealth -= 1
        }
    }

    // Check if game is over
    if (nanonautHealth <= 0) {
        gameMode = GAME_OVER_GAME_MODE
        screenshake = false
    }
}

function updateRobots() {
    // Move and animate robots.
    var nanonautTouchedARobot = false
    for (var i = 0; i < robotData.length; i++) {
        if (doesNanonautOverlapRobot(nanonautX + nanonautCollisionRectangle.xOffset, nanonautY + nanonautCollisionRectangle.yOffset, nanonautCollisionRectangle.width, nanonautCollisionRectangle.height, robotData[i].x + robotCollsionRectangle.xOffset, robotData[i].y + robotCollsionRectangle.yOffset, robotCollsionRectangle.width, robotCollsionRectangle.height)) {
            nanonautTouchedARobot = true
        }
        robotData[i].x -= ROBOT_X_SPEED
        if ((gameFrameCounter % ROBOT_ANIMATION_SPEED) === 0) {
            robotData[i].frameNr += 1
            if (robotData[i].frameNr >= ROBOT_NR_ANIMATION_FRAMES) {
                robotData[0].frameNr = 0
            }
        }
    }

    // Remove robots that have gone off-screen
    var robotIndex = 0
    while (robotIndex < robotData.length) {
        if (robotData[robotIndex].x < cameraX - ROBOT_WIDTH) {
            robotData.splice(robotIndex, 1)
        } else {
            robotIndex += 1
        }
    }

    if (robotData.length < MAX_ACTIVE_ROBOTS) {
        var lastRobotX = CANVAS_WIDTH
        if (robotData.length > 0) {
            var lastRobotX = robotData[robotData.length - 1].x
        }
        var newRobotX = lastRobotX + MIN_DISTANCE_BETWEEN_ROBOTS + Math.random() * (MAX_DISTANCE_BETWEEN_ROBOTS - MIN_DISTANCE_BETWEEN_ROBOTS)
        robotData.push({
            x: newRobotX,
            y: GROUND_Y - ROBOT_HEIGHT,
            frameNr: 0
        })
    }

    return nanonautTouchedARobot
}

function doesNanonautOverlapRobotAlongOneAxis(nanonautNearX, nanonautFarX, robotNearX, robotFarX) {
    var nanonautOverlapsNearRobotEdge = (nanonautFarX >= robotNearX) && (nanonautFarX <= robotFarX)
    var nanonautOverlapsFarRobotEdge = (nanonautNearX >= robotNearX) && (nanonautNearX <= robotFarX)
    var nanonautOverlapsEntireRobot = (nanonautNearX <= robotNearX) && (nanonautFarX >= robotFarX)

    return nanonautOverlapsEntireRobot || nanonautOverlapsFarRobotEdge || nanonautOverlapsNearRobotEdge
}

function doesNanonautOverlapRobot(nanonautX, nanonautY, nanonautWidth, nanonautHeight, robotX, robotY, robotWidth, robotHeight) {
    var nanonautOverlapsRobotOnXAxis = doesNanonautOverlapRobotAlongOneAxis(nanonautX, nanonautX + nanonautWidth, robotX, robotX + robotWidth)
    var nanonautOverlapsRobotOnYAxis = doesNanonautOverlapRobotAlongOneAxis(nanonautY, nanonautY + nanonautHeight, robotY, robotY + robotHeight)
    return nanonautOverlapsRobotOnXAxis && nanonautOverlapsRobotOnYAxis
}

// DRAWING
function draw() {
    // shake screen if necessay
    var shakenCameraX = cameraX
    var shakenCameraY = cameraY

    if (screenshake) {
        shakenCameraX += (Math.random() - .5) * SCREENSHAKE_RADIUS
        shakenCameraY += (Math.random() - .5) * SCREENSHAKE_RADIUS
    }

    // Clear Screen
    c.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Spritesheet function
    function drawAnimatedSprite(screenX, screenY, frameNr, spriteSheet) {
        var spriteSheetRow = Math.floor(frameNr / spriteSheet.nrFramesPerRow)
        var spriteSheetColumn = frameNr % spriteSheet.nrFramesPerRow
        var spriteSheetX = spriteSheetColumn * spriteSheet.spriteWidth
        var spriteSheetY = spriteSheetRow * spriteSheet.spriteHeight
        c.drawImage(spriteSheet.image, spriteSheetX, spriteSheetY, spriteSheet.spriteWidth, spriteSheet.spriteHeight, screenX, screenY, spriteSheet.spriteWidth, spriteSheet.spriteHeight)
    }

    // Draw the sky
    c.fillStyle = "LightSkyBlue"
    c.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y - 40)

    // Draw the background
    var backgroundX = -(shakenCameraX % BACKGROUND_WIDTH) - 150
    c.drawImage(backgroundImage, backgroundX, -210)
    c.drawImage(backgroundImage, backgroundX + BACKGROUND_WIDTH, -210)
    if (FULLSCREEN === true)
        c.drawImage(backgroundImage, backgroundX + BACKGROUND_WIDTH + BACKGROUND_WIDTH, -210)

    // Draw the ground
    c.fillStyle = "forestGreen"
    c.fillRect(0, GROUND_Y - 40, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y + 40)

    // Draw the bushes
    for (var i = 0; i < bushData.length; i++) {
        c.drawImage(bushData[i].image, bushData[i].x - shakenCameraX, GROUND_Y - bushData[i].y - cameraY)
    }

    // Draw the robots
    for (var i = 0; i < robotData.length; i++) {
        drawAnimatedSprite(robotData[i].x - shakenCameraX, robotData[i].y - cameraY, robotData[i].frameNr, robotSpritesheet)
    }

    // Draw the Nanonaut
    drawAnimatedSprite(nanonautX - shakenCameraX, nanonautY - cameraY, nanonautFrameNr, nanonautSpriteSheet)

    // Scoring
    var nanonautDistance = nanonautX / 50
    c.fillStyle = 'black'
    c.font = '48px sans-serif'
    c.fillText(nanonautDistance.toFixed(0) + 'm', 20, 40)

    // Draw health bar
    c.fillStyle = 'red'
    c.strokeStyle = 'red'
    
    if (FULLSCREEN) {
        c.fillRect(CANVAS_WIDTH - 400, 10, nanonautHealth / NANONAUT_MAX_HEALTH * 380, 25)
        c.strokeRect(CANVAS_WIDTH - 400, 10, 380, 25)

    } else {
        c.fillRect(400, 10, nanonautHealth / NANONAUT_MAX_HEALTH * 380, 20)
        c.strokeRect(400, 10, 380, 20)
    }

    // If the ame is over draw GAME OVER

    if (gameMode == GAME_OVER_GAME_MODE) {
        c.fillStyle = "black"
        c.font = '96px sans-serif'

        if (FULLSCREEN)
            c.fillText('GAME OVER!', (CANVAS_WIDTH / 2) - (630 / 2), CANVAS_HEIGHT / 2)
        else
            c.fillText('GAME OVER!', 120, CANVAS_HEIGHT / 2)

    }
}

// CREDITS
console.log("     NANONAUT PROJECT CRATED BY - MOHAMMAD ISLAM \n\
            Create using CoderDojo <NAND>\n\
                Create with <CODE>\n\n\
                MAKE YOUR OWN GAME\n\
---------------------------------------------------------\n\
          Sprites and gameidea by CoderDojo")
