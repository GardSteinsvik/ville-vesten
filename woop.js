const KORMANG = 10000;
var megaindex = 0;
const megarandom = new Float32Array(KORMANG).map(() => Math.random());

const rand = (a)    => (a + 1)*megarandom[++megaindex % KORMANG] | 0;
const rint = (a, b) => a + rand(b - a);
const velg = (l)    => l[rand(l.length - 1)];

const rgb  = (r, g, b)    => `rgb( ${r}, ${g}, ${b})`
const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`

const grense = (a, x, b) => Math.min(Math.max(a, x), b)
const fargegrense = (x) => grense(0, x, 255);
const fargefunk = (fff) => fff.concat(fff.slice(0, -1).reverse())
const repfarge = (fff, lll = 10) => (new Array(lll)).fill("#fff").map((o, i) => (i % (fff.length*2)) === (i % (fff.length)) ?
                                                                      fff[                  i % fff.length ] :
                                                                      fff[fff.length - 1 - (i % fff.length)]);

function genfarge(n) {
    let farger = []
    let ri = rint(0, 255);
    let gi = rint(0, 255);
    let bi = rint(0, 255);

    let [ lo,  hi] = [[-100,        -20], [  20,        100]];
    let [rlo, rhi] = [rint(lo[0], lo[1]), rint(hi[0], hi[1])];
    let [glo, ghi] = [rint(lo[0], lo[1]), rint(hi[0], hi[1])];
    let [blo, bhi] = [rint(lo[0], lo[1]), rint(hi[0], hi[1])];

    for (let i = 0; i < n; i += 1) {
        farger.push(rgb(ri, gi, bi))
        
        ri = fargegrense(ri + rint(rlo, rhi));
        gi = fargegrense(gi + rint(glo, ghi));
        bi = fargegrense(bi + rint(blo, bhi));
    }

    return farger;
}

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

const farger = [
    ["#ef3b2c", "#cb181d", "#a50f15", "#a50f15", "#a50f15", "#67000d", "#67000d", "#67000d"],
    ["#793FCF", "#DF2AAC", "#FF4B80", "#FF885C", "#FFC350", "#F9F871"],
    ["#ED5E93", "#FF737F", "#FF916D", "#FFB360"],
    ["#ACACAC", "#999CA1", "#828E95", "#6A8086", "#537372", "#43655A"],
];

let kossfarge = rand(1) ?
    velg(farger) :
    fargefunk(genfarge(80))
    

const velgfunk = velg([
    () => 1,
    () => 0,
    () => rand(1)
]);

class Ripple {
    constructor({x, y, rmax, r}) {
        this.funk = velgfunk() ? circlefunk(x, y) : squarefunk(x, y);
        this.inc  = 1.6*Math.random() + 1;
        this.rmax = rmax || rint(100, 400 + 210*(devicePixelRatio - 1));
        this.r    = r    || 0;
        this.k = 0;
        this.x = x;
        this.y = y;
        this.rot = 0;
        this.rotdir = (-1)**rand(1);
        this.rotinc = 0.1*Math.random() + 0.0001;
        this.locoff = 100*Math.random()*this.rotdir;
        this.color = velg(kossfarge);
        this.rd = 0;
    }

    draw(t) {
        if (this.r <= this.rmax) {
            ctx.fillStyle = this.color;

            ctx.beginPath();
            this.funk(this.r, this.rot);
            this.funk(this.k, this.rot);
            ctx.closePath();

            ctx.fill("evenodd");
        }

        let wowr = 0.5*this.inc*Math.sin(t + this.locoff) + this.inc;

        this.r += wowr;
        this.rot += this.rotinc*this.rotdir*wowr;
        this.k = this.r*(1 - (this.rmax - this.r)/this.rmax);
    }
}

class Rippledings {
    constructor(length) {
        this.ripples = new Array(length).fill(0).map(() => new Ripple({x: 0, y: 0, rmax: -1, r: 1}));
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

let rrr = new Rippledings(50);

const ops = ["source-over", "xor", "hard-light"];
var opindex = rand(ops.length) - 1;

let ctx = canvas.getContext("2d", { alpha: false });
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.globalCompositeOperation = ops[opindex];

const xy = (e) => ({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
});

const vent = velg([(s) => s, (s) => rint(s, s + 400)]) 
const rep = async (f, n, s = 0) => {
    f();

    return !n || new Promise(resolve => {
        setTimeout(() => {
            rep(f, n - 1, s)
        }, vent(s))
    });
}

const kulfunk = (kor) => rep(() => rrr.push(kor), rand(8) + 1, 300);

kulfunk({ x: canvas.width/2, y: canvas.height/2 });

// kanskje velg neste i nærheten av forrige
let effect = window.setInterval(
    () => {
        let her = {
            x: rint(rect.left, rect.right),
            y: rint(rect.top,  rect.bottom)
        }

        kulfunk(her)
    },
    2800
)

const dereg     = (e) => window.clearInterval(effect);
const keyfunk   = (e) => !(e.key === "n") || (ctx.globalCompositeOperation = ops[opindex++ % ops.length]);
const mousefunk = (e) => rrr.push(xy(e));
const touchfunk = (e) => {
    for (let touch of e.changedTouches) {
        rrr.push(xy(touch));
    }
};

// disable effect
window.addEventListener("touchstart", dereg);
window.addEventListener("mousedown",  dereg);
// interaction
window.addEventListener("touchstart", touchfunk);
window.addEventListener("mousedown",  mousefunk);
window.addEventListener("keydown",    keyfunk);

const faderate = 0.028*Math.random() + 0.006;
let clear = velg([
    // // standard clear
    // () => { ctx.clearRect(0, 0, canvas.width, canvas.height) },

    // fade to black
    () => {
        ctx.fillStyle = rgba(0, 0, 0, faderate);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    },

    // // fade to white
    // () => {
    //     ctx.fillStyle = rgba(127, 127, 127, 0.01);
    //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    // }

    // // persist
    // () => {}
]);

function update(t) {
    window.requestAnimationFrame(update);
    clear();
    rrr.frame(t);
}

window.requestAnimationFrame(update);
