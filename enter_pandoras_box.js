var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

var canvasWidth = canvas.width;
var canvasHeight = canvas.height;



var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;


var radius = 17;

var colorIndex = 0;
var colors = [
    '#46daff',
    '#ff3856',
    '#ffe454'
];

var angle = 0;
var MIN_RADIUS = 0;
var MAX_RADIUS = 150;

var rows = 11, cols = 11;

var fl = 250;
var vpX = canvas.width / 2;
var vpY = canvas.height / 2;

var circles = [];

generateObjects();

drawFrame();
function drawFrame() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);

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
        var amountOfCirclesInGrid = (rows-1)*(cols-1);
        circles.splice(circles.length - amountOfCirclesInGrid, amountOfCirclesInGrid);
    }
    requestAnimationFrame(drawFrame);
}

function generateObjects() {
    var xpos = -vpX;
    var ypos = -vpY;

    for (var i = 0; i < rows-1; i++) {
        ypos = -vpY;
        xpos += canvasWidth/rows;

        for (var j = 0; j < cols-1; j++) {
            ypos += canvasHeight/cols;

            var color = colors[colorIndex];
            circles.unshift(new Object3d(xpos, ypos, radius, color));
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