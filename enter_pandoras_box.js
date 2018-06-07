var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;


var radius = 20;

var colorIndex = 0;
var colors = [
    '#46daff',
    '#ff3856',
    '#ffe454'
];

var angle = 0;
var MIN_RADIUS = 0;
var MAX_RADIUS = 150;

var rows = 10, cols = 10;

var fl = 250;
var vpX = canvas.width / 2;
var vpY = canvas.height / 2;

var circles = [];

generateObjects();

drawFrame();
function drawFrame() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    vpX = canvas.width / 2;
    vpY = canvas.height / 2;

    angle += Math.PI/64;
    var variation = MIN_RADIUS + MAX_RADIUS * Math.sin(angle);
    fl = 250 + variation;

    circles.forEach(move);
    circles.forEach(colorize);

    circles.forEach(draw);

    if (circles[0].zpos % 650 === 0) {
        generateObjects();
    }

    if (!circles[circles.length-1].visible) {
        var amountOfCirclesInGrid = rows*cols;
        circles.splice(circles.length - amountOfCirclesInGrid, amountOfCirclesInGrid);
    }
    requestAnimationFrame(drawFrame);
}

function generateObjects() {
    var xpos = -vpX;
    var ypos = -vpY;

    for (var i = 0; i < rows; i++) {
        ypos = -vpY;
        xpos += canvas.width/(rows+1);

        for (var j = 0; j < cols; j++) {
            ypos += canvas.height/(cols+1);

            var color = colors[colorIndex];
            var circle = new Circle3d(radius);
            circle.xpos = xpos;
            circle.ypos = ypos;
            circle.zpos = 1500;
            circle.vz = -5;
            circle.color = color;
            circles.unshift(circle);
        }
    }
}

function move(object) {
    object.xpos += object.vx;
    object.ypos += object.vy;
    object.zpos += object.vz;

    if (object.zpos > -fl) {
        var scale = fl / (fl + object.zpos);
        object.scaleX = object.scaleY = scale;
        object.x = vpX + object.xpos * scale;
        object.y = vpY + object.ypos * scale;
        object.visible = true;
    } else {
        object.visible = false;
    }
}

function colorize(object) {
    if (object.zpos % 100 === 0) {
        object.color = colors[++object.colorIndex%colors.length];
    }
}

function draw (object) {
    if (object.visible) {
        object.draw(context);
    }
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
