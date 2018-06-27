const KORMANG = 10000;
var megaindex = 0;
const megarandom = new Float32Array(KORMANG).map(() => Math.random());

const rand = (a) => (a + 1)*megarandom[++megaindex % KORMANG] | 0;
const rint = (a, b) => a + rand(b - a);

const grense = (a, x, b) => Math.min(Math.max(x, a), b)

const circlefunk = (x, y) => (r, rot) => {    
    ctx.arc(x, y, r, 0, Math.PI*2);
}

const squarefunk = (x, y) => (r, rot) => {
    ctx.save();
    
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.rect(-r/2, -r/2, r, r);

    ctx.restore();
}

const farge = ([
    ["#ef3b2c", "#cb181d", "#a50f15", "#a50f15", "#a50f15", "#67000d", "#67000d", "#67000d"],
    ["#793FCF", "#DF2AAC", "#FF4B80", "#FF885C", "#FFC350", "#F9F871"],
    ["#ED5E93", "#FF737F", "#FF916D", "#FFB360"],
    ["#ACACAC", "#999CA1", "#828E95", "#6A8086", "#537372", "#43655A"],
])[rand(3)];

const velgfunk = ([
    () => 1,
    () => 0,
    () => rand(1)
])[rand(2)];

class Ripple {
    constructor({x, y}) {
        this.funk = velgfunk() ? circlefunk(x, y) : squarefunk(x, y);
        this.rmax = rint(100, 300);
        this.inc  = 1.6*Math.random() + 1;
        this.r = 0;
        this.k = 0;
        this.x = x;
        this.y = y;
        this.rot = 0;
        this.rotdir = (-1)**rand(1);
        this.rotinc = 0.028*Math.random() + 0.001;
        this.locoff = 100*Math.random()*this.rotdir;
        this.color = farge[rand(farge.length - 1)];
        this.rd = 0;
    }

    draw(t) {
        if (this.r <= this.rmax) {
            ctx.fillStyle = this.color;
            
            ctx.beginPath();
            this.funk(this.r, this.rot)
            this.funk(this.k, this.rot)
            ctx.closePath();
            
            ctx.fill("evenodd")
        }

        let wowr = 0.5*this.inc*Math.sin(t + this.locoff) + this.inc;
        
        this.r += wowr;
        this.rot += this.rotinc*this.rotdir*wowr
        this.k = this.r*(1 - (this.rmax - this.r)/this.rmax)
    }
}

const deadripple = new Ripple(0, 0);
deadripple.r = deadripple.rmax + 10;

class RippleDings {
    constructor(length) {
        this.ripples = new Array(length).fill(0).map(() => { let r = new Ripple(0, 0); r.r = r.rmax + 10; return r });
        this.length = length;
        this.index = 0;
    }

    push({x, y}) {
        this.ripples[this.index++ % this.length] = new Ripple({x, y});
    }

    frame(t) {
        for (let ripple of this.ripples) {
            ripple.draw(t/500.0);
        }
    }
}

let rect = canvas.getBoundingClientRect();
const xy = (e) => ({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
});


const mousefunk = (e) => rrr.push(xy(e));
const touchfunk = (e) => {
    for (let touch of e.changedTouches) {
        rrr.push(xy(touch));
    }
};

window.addEventListener("touchstart", touchfunk)
window.addEventListener("mousedown",  mousefunk)

let rrr = new RippleDings(50);
let ctx = canvas.getContext("2d", { alpha: false });
ctx.globalCompositeOperation = (["multiply", "xor"])[rand(1)];

function update(t) {
    window.requestAnimationFrame(update);
    ctx.fillStyle = "red"
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rrr.frame(t);
}

window.requestAnimationFrame(update);
