var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

var angle = 0;




var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

var xpos = canvas.width/2;
var ypos = canvas.height/2;

var color = getRandomColor();
context.translate(xpos,ypos);

var minRadius = xpos/8;
var n = 0;
function draw() {

    context.beginPath();

    var radius = minRadius + xpos * Math.abs(Math.sin(angle));

    if ((radius - minRadius) < 0.0001) {
        color = getRandomColor();
    }

    context.arc(xpos, ypos, radius, 0, Math.PI * 2, false);

    context.closePath();

    context.fillStyle = color;

    context.rotate(90);

    context.fill();

    angle += Math.PI / 64;

    requestAnimationFrame(draw);
}
draw();

function resetTransform(context) {
    context.setTransform(1, 0, 0, 1, 0, 0);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function nextColor(color) {
    color = color.substr(1, 6);
    var letters = '0123456789ABCDEF';
    var colorType = (2 * Math.floor(Math.random() * 3)) + 2;

    var newColor = '#';

    for (var i = 0; i < 6; i++) {
        if (!(i === colorType)) {
            newColor += color[i];
        } else {
            var colorIndex = (color.indexOf(color.substr(colorType, 1)) + 1) % 16;
            newColor += letters[colorIndex];
        }
    }
    return newColor;
}