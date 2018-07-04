"use strict";

// tja
const KORMANG = 10000;
var megaindex = 0;
const megarandom = new Float32Array(KORMANG).map(() => Math.random());

const rand = (a)    => (a + 1)*megarandom[++megaindex % KORMANG] | 0;
const rint = (a, b) => a + rand(b - a);
const velg = (l)    => l[rand(l.length - 1)];

class Musedings {
    constructor(n) {
        this.musx = new Uint32Array(n);
        this.musy = new Uint32Array(n);
        this.kor  = 0;
        this.n    = n;
    }

    push(x, y) {
        this.musx[this.kor] = x;
        this.musy[this.kor] = y;
        this.kor = (this.kor + 1) % this.n;
    }

    fetch(k) {
        let ka =  Math.abs(this.kor + k) % this.n;

        return [this.musx[ka], this.musy[ka]];
    }

    fyll(oxs, oys) {
        for (let ak = 0; ak < this.n; ak += 1) {
            let ka = (this.kor + ak) % this.n;

            oxs[ak] = this.musx[ka];
            oys[ak] = this.musy[ka];
        }
    }
}

class Celledings {
    constructor(hvorstor = 4, margin = 2, w = 0, h = 0) {
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
        this.fx = new Float32Array(this.alle);
        this.fy = new Float32Array(this.alle);
        this.fr = new Float32Array(this.alle);
        this.ir = new Uint32Array(this.alle);
        this.farge = new Uint8Array(this.alle);
        this.state = new Uint8Array(this.alle);

        for (let i = 0; i < this.alle; i += 1) {
            let x = this.total*(i % this.perrad);
            let y = this.total*Math.floor(i/this.perrad);

            // x -= Math.floor(i/this.perrad) % 2 ? Math.round(this.total/2) : 0;
            
            this.x[i] = x;
            this.y[i] = y;
            this.fx[i] = x;
            this.fy[i] = y;
        }
    }
}

const fargerev = (s) => s[0] === "#" ? hexrev(s) : rgbrev(s);
const rgbrev   = (s) => s.slice(s.indexOf('(') + 1, -1).split(',').map(x => parseInt(x, 10));
const hexrev   = (s) => s.length === 7 ?
      s.slice(1).match(/.{2}/g).map(x => parseInt(x,     16)) :
      s.slice(1).match(/.{1}/g).map(x => parseInt(x + x, 16))

const zip  = (a, b) => a.length <= b.length ?
      a.map((aaaa, i) => [aaaa, b[i]]) :
      b.map((bbbb, i) => [a[i], bbbb])

// tar to sett a, b med farger der både a og b er av lengde m
// og et heltall n, og lager en matrise m x n
//
//   1      j      n
// [[a1 ... x1 ... b1]
//  [a2 ... x2 ... b2]
//           .
//           .
//           .
//  [ai ... xi ... bi]
//           .
//           .
//           .
//  [am ... xm ... bm]]
//
//  j = floor(n/2)
//
// der ai og bi er den i-te fargen i hvert sitt sett, og xi er fargen omtrent halvveis mellom ai og bi.

function lerpfarge(a, b, n = 10) {
    let lerp = (abi) => {
        let ret = new Array(n);
        let ai = abi[0];
        let bi = abi[1];

        for (let i = 0; i < n; i++) {
            let ni = [0, 0, 0]

            ni[0] = Math.floor((1 - i/n)*ai[0] + (i/n)*bi[0]);
            ni[1] = Math.floor((1 - i/n)*ai[1] + (i/n)*bi[1]);
            ni[2] = Math.floor((1 - i/n)*ai[2] + (i/n)*bi[2]);

            ret[i] = ni;
        }

        return ret;
    }

    let ab = zip(a.map(fargerev), b.map(fargerev))
        .map(lerp)
        .map(l => l.map(c => rgb(c[0], c[1], c[2])));

    return ab;
}

const farge = [
    ["#ef3b2c", "#cb181d", "#a50f15", "#a50f15", "#a50f15", "#67000d", "#67000d", "#67000d"],
    ["#793FCF", "#DF2AAC", "#FF4B80", "#FF885C", "#FFC350", "#F9F871"],
    ["#ED5E93", "#FF737F", "#FF916D", "#FFB360"],
    ["#ACACAC", "#999CA1", "#828E95", "#6A8086", "#537372", "#43655A"],
    //  ["#a1a1a1"]
]

const rgb = (r, g, b) => `rgb(${r}, ${g}, ${b})`
const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`
const grense = (a, x, b) => Math.min(Math.max(a, x), b)
const fargegrense = (x) => grense(0, x, 255);
const fargefunk = (fff) => fff.concat(fff.slice(0, -1).reverse())
const wowfarge = (fff) => fff.map(() => velg(fff))
const zapfarge = (fff, lll = 10) => (new Array(lll)).fill("#fff").map((o, i) => velg(fff))
const repfarge = (fff, lll = 10) => (new Array(lll)).fill("#fff").map((o, i) => (i % (fff.length*2)) === (i % (fff.length)) ?
                                                                      fff[                  i % fff.length ] :
                                                                      fff[fff.length - 1 - (i % fff.length)])

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

const mapkey = (f, o) => Object.keys(o).reduce((ny, k) => {
    ny[k] = f(o[k]);

    return ny;
}, {});

let hvorstor = 6*grense(0, devicePixelRatio, 2);
let margin   = 6*grense(0, devicePixelRatio, 2);
var ccc = new Celledings(hvorstor, margin);

const cw = canvas.width;
const ch = canvas.height;
const mmm = 20;
const zzz = mmm*2;

var kossfarge = rand(1) ?
    repfarge(velg(farge), zzz*2 - 1) :
    fargefunk(genfarge(zzz));

var ifarge = 0;

// ???
var r = 19.0;

var sulten = false;
var lerpliste = [];
var istart = 0;
function mere() {
    if (!sulten) {
        //                        ikke vilt stilig
        //                               |
        //                               v
        let a = fargefunk(genfarge(zzz)).slice(0, Math.min(zzz*2 - 1, kossfarge.length));
        let b = kossfarge;

        lerpliste = lerpfarge(a, b, 6);
        sulten = true;
        istart = ifarge;
    }
}

var itest = 0;
function knask() {
    let ifargern = ifarge;
    let tygg = lerpliste[ifargern].pop();

    if (tygg) {
        // kan egentlig droppe kossfarge,
        // men kanskje greit å ha både atlas og hex?
        kossfarge[ifargern] = tygg;
        lerpatlas(ifargern);
        itest = 0;
    } else if (ifargern === istart) {
        itest += 1;

        if (itest >= 2) {
            itest = 0;
            sulten = false;
            console.log("wow");
        }
    }
}

// mus
window.addEventListener("mousemove", hvorerting);

// touch
// window.addEventListener("touchstart", (e) => {
//     hvorerting(e.touches[0]);
// });
window.addEventListener("touchmove", (e) => {
    hvorerting(e.touches[0]);
});

let dtouch = { x: 0, y: 0 }
window.addEventListener("touchmove", (e) => {
    if (e.touches.length >= 2) {
        // UHUI TIME TO PLAY TOMBI
    }
});

window.addEventListener("keydown", (e) => {
    switch (e.key) {
    case "p": r += 1; break;
    case "o": r -= 1; break;
    case "l": s += 1; break;
    case "k": s -= 1; break;
    case "a": mere(); break;
    }
});

// atlas
var offcanvas = document.createElement("canvas");
let stride = ccc.total;
let radius = ccc.hvorstor;
let antall = kossfarge.length;
offcanvas.width  = stride*antall;
offcanvas.height = stride;

// uten offset
var offctx = offcanvas.getContext("2d", { alpha: false });

// offctx.scale(devicePixelRatio, devicePixelRatio);

function atlasfunk() {
    for (let i = 0; i < antall; i += 1) {
        offctx.fillStyle = kossfarge[i];

        offctx.beginPath();
        offctx.arc(stride*i + radius, radius, radius, 0, 2*Math.PI);
        offctx.closePath();

        offctx.fill();
    }
}

atlasfunk();

function lerpatlas(i) {
    if (i > (antall - 1)) { console.log(i); }
    
    offctx.clearRect(i*stride, 0, stride, stride);
    offctx.fillStyle = kossfarge[i];
    
    offctx.beginPath();
    offctx.arc(stride*i + radius, radius, radius, 0, 2*Math.PI);
    offctx.closePath();

    offctx.fill();
}

const offupdatefunk = (t) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < ccc.alle; i += 1) {
        if (ccc.state[i] > 0) {
            let fafafa = ccc.farge[i];
            let x = ccc.x[i];
            let y = ccc.y[i];
            let sc = grense(0.01, ccc.fr[i], radius)
            
            ctx.drawImage(offcanvas, fafafa*stride, 0, stride, stride, x - sc, y - sc, sc*2, sc*2);
            
            ccc.state[i] = 0;
        }
    }  
}

const ctx = canvas.getContext("2d", { alpha: false });
// ctx.scale(devicePixelRatio, devicePixelRatio);

const updatefunk = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < ccc.alle; i += 1) {
        if (ccc.state[i] > 0) {
            ctx.fillStyle = kossfarge[ccc.farge[i]];
            
            ctx.beginPath();
            ctx.arc(ccc.x[i], ccc.y[i], grense(0, ccc.fr[i], ccc.hvorstor), 0, 2*Math.PI);
            ctx.closePath();
            
            ctx.fill();

            ccc.state[i] = 0;
        }
    }
};

function geomdingstre(t) {
    let ttt = t/500.0;
    let rmod = r + 1;
    mus.fyll(oxs, oys);

    for (let k = mmm - 1; k > 0; k -= 1) {
        for (let i = 0; i < ccc.state.length; i += 1) {
            let krot = (-1)**k*ttt*3/(k + 1.0);
            let pr = rot(oxs[mmm - k], oys[mmm - k], ccc.fx[i], ccc.fy[i], krot);
            let x = sirkel(oxs[mmm - k], oys[mmm - k], pr[0], pr[1], k*rmod + 10.0*s + bredde, eukdiststabil);
            let y = sirkel(oxs[mmm - k], oys[mmm - k], pr[0], pr[1], k*rmod + 10.0*s,          eukdiststabil);
            // let c = cut(x, y);
            // let c = strek(oxs[mmm - k], oys[mmm - k], pr[0], pr[1], Math.sin(ttt/100)**2*50);
            let c = cap(cut(x, y), strek(oxs[mmm - k], oys[mmm - k], pr[0], pr[1], 100 + 75*Math.sin(ttt/10)));

            if (c <= 0.0) {
                ccc.fr[i] = -c;
                
                if (ccc.state[i] === 1) {
                    ccc.farge[i] = zzz - 1 - ((k + ifarge) % zzz);
                    ccc.state[i] = 2;
                } else {
                    ccc.farge[i] = (k + ifarge) % zzz;
                    ccc.state[i] = 1;
                }
            }
        }
    }
}

let rect = canvas.getBoundingClientRect();
const touchfunk = (e) => {
    for (let touch of e.changedTouches) {
        ripplepush(woopx(touch), woopy(touch));
    }
}

window.addEventListener("mousedown", () => ripplepush(must[0], must[1]))
window.addEventListener("touchstart", touchfunk)

// uhui
const megafunk = velg([() => 0, () => 1, () => rand(1)]);
const velgfunk = (ox, oy) => megafunk() ?
      (px, py, r, rad) => sirkel(ox, oy, px, py, r, eukdiststabil) :
      (px, py, r, rad) => sirkelrot(ox, oy, px, py, r, mandist, rad)

const ripplemax = 500.0;
const ripplelength = 20;
const ripplefunk = (ox, oy, r = 0) => ({
    f: velgfunk(ox, oy),
    r: r,
    rmax: ripplemax, // rint(200, ripplemax),
    rot: rint(1, 56)
});

let ripple = [];
for (let i = 0; i < ripplelength; i += 1) {
    ripple.push(ripplefunk(0, 0, ripplemax + 10.0));
}

var iripple = 0;
const ripplepush = (ox, oy) => {
    let i = iripple++ % ripplelength;

    if (ripple[i].r > ripple[i].rmax) {
        ripple[i] = ripplefunk(ox, oy, 0);
    }
}

function geomdingsto(t) {
    let ttt = t/600.0;

    for (let i = 0; i < ccc.state.length; i += 1) {
        for (let irip = 0; irip < ripplelength; irip += 1) {
            let rip = ripple[irip];

            if (rip.r < rip.rmax) {
                let rrot = (-1)**rip.rot*ttt*10.0/(rip.rot + 1.0);
                let ra = rip.r;
                let rb = rip.r - 300.0*(((rip.rmax - rip.r)/(rip.rmax))**2)
                let x = rip.f(ccc.fx[i], ccc.fy[i], ra, rrot)
                let y = rip.f(ccc.fx[i], ccc.fy[i], rb, rrot)
                let c = cut(x, y);

                if (c <= 0.0) {
                    ccc.fr[i] = -c;
                    
                    if (ccc.state[i] === 1) {
                        ccc.farge[i] = zzz - 1 - (irip % zzz);
                        ccc.state[i] = 2;
                    } else {
                        ccc.farge[i] = irip % zzz;
                        ccc.state[i] = 1;
                    }
                }
            }
        }
    }

    for (let rip of ripple) {
        rip.r += 5.0;
    }
}

var s = 0.0;
var oxs = new Uint32Array(mmm);
var oys = new Uint32Array(mmm);
var bredde = 28.0;
function geomdings(t) {
    let ttt = t/500.0;
    let rmod = r + 1;
    mus.fyll(oxs, oys);

    for (let k = mmm - 1; k > 0; k -= 1) {
        for (let i = 0; i < ccc.state.length; i += 1) {
            let krot = (-1)**k*ttt/(k + 1.0);
            let pr = rot(oxs[mmm - k], oys[mmm - k], ccc.fx[i], ccc.fy[i], krot);
            let x = sirkel(oxs[mmm - k], oys[mmm - k], pr[0], pr[1], k*rmod + 10.0*s + bredde, mandist);
            let y = sirkel(oxs[mmm - k], oys[mmm - k], pr[0], pr[1], k*rmod + 10.0*s,          mandist);
            let c = cut(x, y);

            if (c <= 0.0) {
                ccc.fr[i] = -c;
                
                if (ccc.state[i] === 1) {
                    ccc.farge[i] = zzz - 1 - ((k + ifarge) % zzz);
                    ccc.state[i] = 2;
                } else {
                    ccc.farge[i] = (k + ifarge) % zzz;
                    ccc.state[i] = 1;
                }
            }
        }
    }
};

// ~~~~
// mus!
// ~~~~

let mus = new Musedings(mmm);
let must = new Uint32Array(2);
must[0] = Math.floor(cw/2);
must[1] = Math.floor(ch/2);
function hvorerting(e) {
    must[0] = woopx(e);
    must[1] = woopy(e);
}

const woopx = ({clientX:x}) => x - rect.left;
const woopy = ({clientY:y}) => y - rect.top;

function pushmus() {
    mus.push(must[0], must[1]);
}

// ~~~~~
// geom!
// ~~~~~

const eledist = (ax, ay, bx, by, eps = 0.5) => (Math.abs(ax - bx) < eps) ?
      Math.abs(ay - by) :
      Math.abs(ay) + Math.abs(ax - bx) + Math.abs(by)
const maidist = (ax, ay, bx, by, eps = 0.1) => ((Math.abs(ax - bx) < eps) && (Math.abs(ay - by) < eps)) ?
      0 :
      Math.sqrt(ax**2 + ay**2) + Math.sqrt(bx**2 + by**2)
const eukdist = (ax, ay, bx, by) => Math.sqrt((ax - bx)**2.0 + (ay - by)**2.0);
const mandist = (ax, ay, bx, by) => Math.abs(ax - bx) + Math.abs(ay - by);
const rot = (ox, oy, px, py, rad) => {
    let cosx = Math.cos(rad);
    let sinx = Math.sin(rad);

    return [(px - ox)*cosx - (py - oy)*sinx + ox,
            (px - ox)*sinx + (py - oy)*cosx + oy];
};

// kanskje mindre bugga
const eukdiststabil = (ax, ay, bx, by) => Math.sqrt(ax**2 - 2*ax*bx + bx**2 +
                                                    ay**2 - 2*ay*by + by**2);

const sirkel = (ox, oy, px, py, r = 1.0, d = eukdiststabil) => d(ox, oy, px, py) - r;
const sirkelrot = (ox, oy, px, py, r = 1.0, d = eukdiststabil, rad = 0.0) => {
    let pr = rot(ox, oy, px, py, rad);

    return sirkel(ox, oy, pr[0], pr[1], r, d);
};

const yhalv = (ox, oy, px, py) => py - oy
const xhalv = (ox, oy, px, py) => px - ox
const strek = (ox, oy, px, py, b) => cut(yhalv(px, py + b/2, ox, oy),
                                         yhalv(px, py - b/2, ox, oy))

const rotrot = (f, ox, oy, px, py, r = 1.0, d = eukdiststabil, rad = 0.0) => {
    let pr = rot(ox, oy, px, py, rad);

    return f(ox, oy, pr[0], pr[1], r, d);
};

const cup = (a, b) => Math.min(a,  b);
const cap = (a, b) => Math.max(a,  b);
const cut = (a, b) =>      cap(a, -b);

// ~~~~~
// anim!
// ~~~~~

let kuldings = velg([geomdings, geomdingsto, geomdingstre]);
var prev = 0;
var acct = 0;
function animasjon(t) {
    window.requestAnimationFrame(animasjon);

    kuldings(t);
    pushmus();
    offupdatefunk(t);

    // ok
    acct += t - prev;
    prev = t;

    if (acct > 110) {
        ifarge = (ifarge + 1) % kossfarge.length;
        acct = 0;

        if (sulten) {
            knask();
        }
    }
};

window.requestAnimationFrame(animasjon);

// viser seg at dette er en blanding av bugga og tregt
// tror det kan være raskere, gitt at
// jeg snekrer sammen noen kule matrisegreier
// <<-- og -->>
// opererer med mindre floats
const theta = 0.1;
const runde = Math.PI;
const rotmat = [ Math.cos(theta), -Math.sin(theta),
                 Math.sin(theta),  Math.cos(theta) ]
const rotsanic = (ox, oy, px, py, rad) => {
    let x = (px - ox);
    let y = (py - oy);
    let m = (rad % runde)/theta;

    for (let i = 0; i < m; i += 1) {
        x = x*rotmat[0] + y*rotmat[1];
        y = x*rotmat[2] + y*rotmat[3];
    }

    return [x + ox, y + oy]
};

// skriv en initfunksjon
window.onresize = () => {
    // etc
    ccc = new Celledings(hvorstor, margin);
    rect = canvas.getBoundingClientRect();
    // canvas
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    // atlas
    stride = ccc.total;
    radius = ccc.hvorstor;
    antall = kossfarge.length;
    offcanvas.width  = stride*antall;
    offcanvas.height = stride;
    atlasfunk();
}
