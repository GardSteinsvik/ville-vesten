// mus
let mus  = { x: canvas.width/2, y: canvas.height/2 };
let rect = canvas.getBoundingClientRect();
function hvorermusa(e) {
    mus.x = e.clientX - rect.left;
    mus.y = e.clientY - rect.top;
}

window.addEventListener("mousemove", hvorermusa)
window.addEventListener("mousewheel", (e) => angle += 0.1*e.deltaY/70)

// touch
function ikkescroll(e) {
    if (e.target === canvas) {
        e.preventDefault();
    }
}

let yp = 0;
function hvorerfingeren(e) {
    if (e.touches.length === 1) {
        hvorermusa(e.touches[0])
    } else {
        let y = e.touches[0].clientY;
        let d = Math.abs(yp - y);
        let s = y > yp ? 1 : -1;

        angle += 0.01*d*s;
        yp = y;
    }
}

window.addEventListener("touchstart", ikkescroll, { passive: false });
window.addEventListener("touchmove",  ikkescroll, { passive: false });
window.addEventListener("touchend",   ikkescroll, { passive: false });

window.addEventListener("touchstart", hvorerfingeren);
window.addEventListener("touchmove",  hvorerfingeren);

var context = canvas.getContext('2d');

var requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame;


var radius = 20;
var colorIndex = 0;
var colors = [
    '#46daff',
    '#ff3856',
    '#ffe454'
];

const pi = Math.PI;
var angle = 0;
const MAX_Z      = 2000;
const MIN_RADIUS = 0;
const MAX_RADIUS = 150;

var rows = 6, cols = 9;

var fl = 250;
var vpX = canvas.width / 2;
var vpY = canvas.height / 2;

var images = [];

generateObjects();

drawFrame(0);

function drawFrame(t) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // angle += .05;

    vpX = canvas.width / 2;
    vpY = canvas.height / 2;

    for (let image of images) {
        move(image, t);
        colorize(image);
        draw(image);
    }

    // images.forEach(move);
    // images.forEach(colorize);
    // images.forEach(draw);

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
        xpos += canvas.width/(cols + 1);

        for (var j = 0; j < rows; j++) {
            ypos += canvas.height/(rows + 1);

            var image = new Image3d('images/colax.png', 'images/poltercolax.png');
            image.xpos = xpos;
            image.ypos = ypos;
            image.zpos = MAX_Z;
            image.col  = i
            image.row  = j
            // image.vy = image.vy + 2*(i + 1)*(-1)**(j)
            // image.vx = image.vx + 2*(j + 1)*(-1)**(i)
            image.vz = -4;
            images.unshift(image);
        }
    }
}

function grense(a, x, b) { return Math.min(Math.max(a, x), b) }
function dingzz(z, m = 500) { return grense(0, (MAX_Z - z), m)/m }

function sign(x)    { return x >=  0 ?  1 :
                      /* */            -1 }
function wowsign(x) { return x >   0 ?  1 :
                      /* */  x === 0 ?  0 :
                      /* */            -1 }

function wowdist(a, b, c = 2*pi) {
    let z = Math.abs(b - a) % c
    let x = c - z;

    return z < x ? z : -x;
}

function snorm(x) {
    return (2*pi + x) % (2*pi)
}

function sflytt(a, b) {
    var [a, b, d] = a > b ? [a, b, 1] : [b, a, -1];

    return Math.min(2*pi - b + a, b - a)*d
}

var drot = 0;
var uhu = 0;
window.setInterval(() => console.log(uhu), 600);
function move(object, t) {
    let ttt = t/1000.0;
    object.xpos += object.vx;
    object.ypos += object.vy;
    object.zpos += object.vz;

    if (object.zpos > -fl) {
        let fax = object.x - mus.x;
        let fay = object.y - mus.y;

        let scale = fl/(fl + object.zpos);
        let rot = snorm(Math.atan2(fay, fax) - pi/2 + angle); uhu = rot;

        object.scaleX = object.scaleY = scale*dingzz(object.zpos, 200);
        object.x = vpX + object.xpos*scale*2;
        object.y = vpY + object.ypos*scale*4;
        object.rotation = rot;
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
