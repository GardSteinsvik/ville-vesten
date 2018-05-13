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

var MIN_RADIUS = 0;
var MAX_RADIUS = 10;

var circles = [];

for (var i = 0; i < 150; i++) {
    var circleGroup = [];

    var x = Math.random() * canvasWidth;
    var y = Math.random() * canvasHeight;

    var AMOUNT_IN_CIRCLE_GROUP = 6;

    var color = getRandomColor();

    for (var j = 0; j < AMOUNT_IN_CIRCLE_GROUP; j++) {
        color = nextSmoothColor(color);
        circleGroup.push(new Circle(x, y, (AMOUNT_IN_CIRCLE_GROUP - j)*5, color));
    }

    circles.push(circleGroup);
}

drawFrame();
function drawFrame() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    var radius = MIN_RADIUS + MAX_RADIUS * Math.abs(Math.tan(angle));

    this.circles.forEach(function (circles) {
        var newX;
        var newY;
        if (radius > canvasWidth) {
            newX = Math.random() * canvasWidth;
            newY = Math.random() * canvasHeight;
        }
        circles.forEach(function (circle) {
            circle.radius = circle.baseRadius + radius;
            if (newX || newY) {
                circle.x = newX;
                circle.y = newY;
            }
            circle.draw(context);
        })
    });

    angle += Math.PI / 128;
    // angle += Math.PI / 64;

    requestAnimationFrame(drawFrame);
}



function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    // console.log(color);
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
    // console.log(newColor);
    return newColor;
}