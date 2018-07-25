// Canvas
var canvas = document.getElementById('coderdojo');
console.log(canvas, canvas.nodeName);
var ccanvas = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//var ccanvas  = canvas.getContext('2d');

// Image
var image = new Image();
image.src = "assets/nanonaut.png";
window.addEventListener('load',start);

function start(){
    loop()
}

// Starting variables for animation
var x = 0;
var y = 40;
function loop() {
    ccanvas.clearRect(0,0,window.innerWidth, window.innerHeight)
    ccanvas.fillStyle = "blue";
    ccanvas.fillRect(x,10,30,30);

    // ccanvas.drawImage(image, x,y);
    x = x + 2
    // y = y+2
    // if (x > window.innerWidth){
        
    // }
    window.requestAnimationFrame(loop);
    
}
