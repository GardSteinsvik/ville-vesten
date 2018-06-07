var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;


var colorIndex = 0;
var colors = [
    '#46daff',
    '#ff3856',
    '#ffe454'
];

var theta = 0;

var fl = 750;
var vpX = canvas.width / 2;
var vpY = canvas.height / 2;

var circles = [];

generateObject();

drawFrame();
function drawFrame() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    vpX = canvas.width / 2;
    vpY = canvas.height / 2;

    circles.forEach(move);
    circles.forEach(colorize);

    circles.forEach(draw);

    generateObject();

    if (!circles[circles.length-1].visible) {
        circles.pop();
    }
    requestAnimationFrame(drawFrame);
}

function generateObject() {
    var distanceFromCenter = 100+20*Math.sin(theta);

    var xpos = distanceFromCenter * Math.cos(theta*theta/10);
    var ypos = distanceFromCenter * Math.sin(theta*theta/10);

    theta += .08;

    var radius = 45+20*Math.sin(theta);
    var color = '#000000';
    circles.unshift(new Object3d(xpos, ypos, radius, color));

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
        // object.color = colors[++object.colorIndex%colors.length];
        object.color = hslToRgb(theta/10%1, 1, .5);
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
    return newColor;
}

function hslToRgb(h, s, l){
    var r, g, b;

    if(s === 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    var resColor = "#";
    resColor += getHex(r);
    resColor += getHex(g);
    resColor += getHex(b);
    return resColor;
}

function getHex(c) {
    var res = Math.round(c * 255).toString(16);
    if (res.length < 2) {
        res = '0'+res;
    }

    return res;
}
