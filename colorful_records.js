var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var angle = 0;

var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

var xpos = canvasWidth / 2;
var ypos = canvasHeight / 2;

var color = getRandomColor();

var clearPos = 0;

var amountOfBallsWithSameColor = 0;

function drawCircle() {
    // context.clearRect(0, 0, canvasWidth, canvasHeight);

    if (amountOfBallsWithSameColor >= 50) {
        amountOfBallsWithSameColor = 0;
        color = getRandomColor();
    }

    clearPos += 2;
    if (clearPos > canvasWidth) {
        clearPos = -5;
    }

    // draw the circle
    context.beginPath();

    var radius = 10 + 40 * Math.abs(Math.cos(angle));

    if (radius <= 15) {

        var k = 8;

        xpos += Math.random() * radius * k - radius * k/2;
        ypos += Math.random() * radius * k - radius * k/2;

        if (xpos < radius) {
            xpos = radius;
        }
        if (xpos > canvasWidth - radius) {
            xpos = canvasWidth - radius;
        }
        if (ypos < radius) {
            ypos = radius;
        }
        if (ypos > canvasHeight - radius) {
            ypos = canvasHeight - radius;
        }
    }

    // context.rect(0,0, 100, 100);
    context.arc(xpos, ypos, radius, 0, Math.PI * 2, false);
    context.closePath();

    // color in the circle
    context.fillStyle = nextColor(color);
    context.fill();

    amountOfBallsWithSameColor++;

    angle += Math.PI / 64;

    requestAnimationFrame(drawCircle);
}

drawCircle();

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

function nextSmoothColor(color) {
    var letters = '0123456789abcdef';
    var newColor = '#';
    for (var i = 0; i < color.length; i++) {
        if (color.charAt(i) === '#') continue;
        var nextIndex = (letters.indexOf(color.charAt(i)) + 1) % letters.length;
        newColor += letters[nextIndex];
    }
    return newColor;
}