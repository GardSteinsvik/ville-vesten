let wowfunk = () => {};

window.addEventListener("mousemove", hvorermusa)
window.addEventListener("mousewheel", (e) => angle += 0.1*e.deltaY/70)
window.setInterval(wowfunk, 60);
 
let mus  = { x: 0, y: 0 };
let rect = canvas.getBoundingClientRect();
function hvorermusa(e) {
  mus.x = e.clientX - rect.left;
  mus.y = e.clientY - rect.top;
}

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

var rows = 6, cols = 6;

var fl = 250;
var vpX = canvas.width / 2;
var vpY = canvas.height / 2;

var images = [];

generateObjects();

drawFrame();
function drawFrame() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // angle += .05;

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
            // image.vy = image.vy + 2*(i + 1)*(-1)**(j)
            // image.vx = image.vx + 2*(j + 1)*(-1)**(i)
            image.vz = -5;
            images.unshift(image);
        }
    }
}

function grense(a, x, b) { return Math.min(Math.max(a, x), b) }
function dingzz(z, m = 500) { return grense(0, (2000 - z), m)/m }

function move(object, k) {
    object.xpos += object.vx;
    object.ypos += object.vy;
    object.zpos += object.vz;

    if (object.zpos > -fl) {
        var scale = fl/(fl + object.zpos);
        object.scaleX = object.scaleY = scale*dingzz(object.zpos, 200)
        object.x = vpX + object.xpos*scale*4;
        object.y = vpY + object.ypos*scale*4;
        let [fax, fay] = [object.x - mus.x, object.y - mus.y];
        object.rotation = Math.acos((fax/Math.sqrt(fax**2 + fay**2)))*(fay > 0 ? 1 : -1) - Math.PI/2 + angle
        object.visible = true;
    } else {
        object.visible = false;
    }
}

function colorize(object) {
    if (object.zpos % 100 === 0) {
        object.color = colors[++object.colorIndex % colors.length];
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
