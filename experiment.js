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

var rows = 4, cols = 6;

var fl = 250;
var vpX = canvas.width / 2;
var vpY = canvas.height / 2;

var images = [];

generateObjects();

drawFrame();
function drawFrame() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    angle += .05;

    vpX = canvas.width / 2;
    vpY = canvas.height / 2;

    images.forEach(move);
    images.forEach(colorize);

    images.forEach(draw);

    if (images[0].zpos % 250 === 0) {
        generateObjects();
    }

    if (!images[images.length-1].visible) {
        var amountOfCirclesInGrid = rows*cols;
        images.splice(images.length - amountOfCirclesInGrid, amountOfCirclesInGrid);
    }
    requestAnimationFrame(drawFrame);
}

function generateObjects() {
    var xpos = -vpX;
    var ypos = -vpY;

    for (var i = 0; i < cols; i++) {
        ypos = -vpY;
        xpos += canvas.width/(cols+1);

        for (var j = 0; j < rows; j++) {
            ypos += canvas.height/(rows+1);

            var image = new Image3d('images/colax.png');
            image.xpos = xpos;
            image.ypos = ypos;
            image.zpos = 2000;
            image.vz = -4;
            images.unshift(image);
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
        object.rotation = angle;
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