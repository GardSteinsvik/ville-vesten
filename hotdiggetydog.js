"use strict";

const KORMANG = 10000;
var megaindex = 0;
const megarandom = new Float32Array(KORMANG).map(() => Math.random());

const rand = (a)    => (a + 1)*megarandom[++megaindex % KORMANG] | 0;
const rint = (a, b) => a + rand(b - a);

const grense = (a, x, b) => Math.min(Math.max(a, x), b);

// eh
const pi = Math.PI;
const sin = Math.sin;
const cos = Math.cos;

// kø
// [{ i: 17, f: op },
//  { i: 28, f: op },
//          .
//          .  
//          .
//  { i: 40, f: op }]

class Celledingz {
    constructor(hvorstor, margin, w, h) {
        this.hvorstor = hvorstor;
        this.margin   = margin;
        this.total    = this.hvorstor + this.margin;

        this.w  = w || window.innerWidth  - (this.total);
        this.h  = h || window.innerHeight - (this.total);
        this.cw = this.w + this.w % this.total;
        this.ch = this.h + this.h % this.total;

        this.perrad = Math.ceil(this.cw/this.total) + 1;
        this.perkol = Math.ceil(this.ch/this.total) + 1;
        this.alle = this.perrad*this.perkol;

        this.x = new Int32Array(this.alle);
        this.y = new Int32Array(this.alle);
        this.r = new Uint8Array(this.alle);
        this.g = new Uint8Array(this.alle);
        this.b = new Uint8Array(this.alle);
        
        for (let i = 0; i < this.alle; i += 1) {
            let x = this.total*(i % this.perrad);
            let y = this.total*Math.floor(i/this.perrad);

            x -= Math.floor(i/this.perrad) % 2 ? Math.round(this.total/2) : 0;
            
            this.x[i] = x;
            this.y[i] = y;
            this.r[i] = rint(0, 255);
            this.g[i] = rint(0, 255);
            this.b[i] = rint(0, 255);
        }
    }
}

let size   = 10 + 4*grense(0, devicePixelRatio - 1, 2);
let margin =  2
var ccc = new Celledingz(size, margin);
const rrr = 6.0;
const ctx = canvas.getContext("2d", { alpha: false })

const end = 2.0*pi;
function sirkeldings(x, y, r, color = "#fff") {
    ctx.fillStyle = color;
    // ctx.rect(x, y, r, r)
    ctx.beginPath();
    ctx.arc(x, y, r, 0.0, end);
    ctx.closePath();
    ctx.fill();
}

let rect = canvas.getBoundingClientRect();
let must = new Uint32Array(2);
must[0] = Math.floor(canvas.width/2);
must[1] = Math.floor(canvas.height/2);
function hvorerting(e) {
    must[0] = woopx(e);
    must[1] = woopy(e);
}

const woopx = ({ clientX:x }) => x - rect.left;
const woopy = ({ clientY:y }) => y - rect.top;

var rz = 0;
var gz = 0;
var bz = 0;

const rgb = (r, g, b) => `rgb(${r}, ${g}, ${b})`
const rfunk = (r, a = -5, b = 5) => Math.round(grense(0, r + rint(a, b), 255));
const fargefunk = (i) => rgb(ccc.r[i] = rfunk(ccc.r[i]),
                             ccc.g[i] = rfunk(ccc.g[i]),
                             ccc.b[i] = rfunk(ccc.b[i]))

const dytt = pi/4.0;
function updatefunk(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let tt = t/1000.0;
    
    for (let k = 0; k < ccc.perkol; k += 1) {
        // for (let zap = k % 2; zap === (k % 2); zap += (-1)**(k % 2)) {
        for (let zap = 0; zap <= 1; zap += 1) {
            for (let j = zap; j < ccc.perrad; j += 2) {
                let i = k*ccc.perrad + j;
                
                let ax = ccc.x[i];
                let ay = ccc.y[i];
                let bx = must[0];
                let by = must[1];

                let felles = sin(tt/4.0)*pi;
                let bra = rot(ax, ay, bx, by, felles);
                let brb = rot(ax, ay, bx, by, felles + cos(tt*pi/4.0));
                let a = mandist(ax, ay, bra[0], bra[1]);
                let b = mandist(ax, ay, brb[0], brb[1]);
                let d = cup(a, b);

                // alt
                // let c = eukdist(ax, ay, bx, by) + 40;
                // let d = cup(a, cup(b, c));

                let kossvei = (-1)**Math.floor(tt);
                
                let r = rrr - grense(0, (d/40.0), rrr) + (1.1*sin(d/15*cos(tt/6)))**3;
                
                if (r > 0.0) {
                    // let z = Math.floor(r/rrr*255.0);
                    // let c = rgb(z, z, z)
                    let c = fargefunk(i);
                    sirkeldings(ax, ay, r**2.0, c);
                }
            }
        }
    }    
}

function animasjon(t) {
    window.requestAnimationFrame(animasjon);
    updatefunk(t);
}

window.requestAnimationFrame(animasjon);
window.addEventListener("mousemove", hvorerting)
window.addEventListener("touchmove", (e) => hvorerting(e.touches[0]));


const mandist = (ax, ay, bx, by) => Math.abs(ax - bx) + Math.abs(ay - by);
const rot = (ox, oy, px, py, rad) => {
    let cosx = cos(rad);
    let sinx = sin(rad);

    return [(px - ox)*cosx - (py - oy)*sinx + ox,
            (px - ox)*sinx + (py - oy)*cosx + oy];
};

// kanskje mindre bugga
const eukdist = (ax, ay, bx, by) => Math.sqrt(ax**2 - 2*ax*bx + bx**2 +
                                              ay**2 - 2*ay*by + by**2);

const sirkel = (ox, oy, px, py, r = 1.0, d = eukdist) => d(ox, oy, px, py) - r;
const sirkelrot = (ox, oy, px, py, r = 1.0, d = eukdist, rad = 0.0) => {
    let pr = rot(ox, oy, px, py, rad);

    return sirkel(ox, oy, pr[0], pr[1], r, d);
};

const cup = (a, b) => Math.min(a,  b);
const cap = (a, b) => Math.max(a,  b);
const cut = (a, b) =>      cap(a, -b);

window.onresize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    rect = canvas.getBoundingClientRect();
    ccc = new Celledingz(size, margin);
}
