"use strict";

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
  constructor(hvorstor, margin, w, h) {
    this.hvorstor = hvorstor;
    this.margin   = margin;
    this.total    = this.hvorstor + this.margin;

    this.w  = w || window.innerWidth  - (this.total);
    this.h  = h || window.innerHeight - (this.total);
    this.cw = this.w + this.w % this.total;
    this.ch = this.h + this.h % this.total;

    this.perrad = Math.floor(this.cw/this.total);
    this.perkol = Math.floor(this.ch/this.total);
    this.alle = this.perrad*this.perkol;
    
    this.x = new Int32Array(this.alle);
    this.y = new Int32Array(this.alle);
    this.fx = new Float32Array(this.alle);
    this.fy = new Float32Array(this.alle);
    this.fr = new Float32Array(this.alle);
    this.color = new Uint8Array(this.alle);
    this.state = new Uint8Array(this.alle);

    for (let i = 0; i < this.alle; i += 1) {
      let x = this.total*(i % this.perrad);
      let y = this.total*Math.floor(i/this.perrad);

      this.x[i] = x;
      this.y[i] = y;
      this.fx[i] = x;
      this.fy[i] = y;
    }
  }
}

const varitsprite = [1, 0, 0, 0, 0,
                     0, 2, 2, 0, 6,
                     3, 2, 2, 6, 6,
                     4, 4, 4, 6, 0,
                     0, 4, 5, 5, 5,
                     0, 0, 5, 5, 5,
                     0, 0, 0, 0, 5];

class Sprite {
  constructor(data, width, height, ccc) {
    this.data = data;
    this.width = width;
    this.height = height;
    this.ccc = ccc;
  }

  draw(ox = 0, oy = 0) {
    for (let i = 0; i < this.height; i += 1) {
      for (let j = 0; j < this.width; j += 1) {
        let x = j + ox;
        let y = i + oy;
        let c = this.data[i*this.width + j]*14;
        var nifarge = (c + ifarge) % kossfarge.length;
        nifarge = nifarge || nifarge + 1

        this.ccc.setcolor(x, y, c ? nifarge : 0);
        this.ccc.setstate(x, y, 2);
      }
    }
  }
}

// tar to sett med farger av samme lengde m og et heltall n, og lager en matrise m x n
//
//   1      j      n
// [[a1 ... m1 ... b1]
//  [a2 ... m2 ... b2]
//           .
//           .
//           .
//  [ai ... mi ... bi]
//           .
//           .
//           .
//  [am ... mm ... bm]]
//
//  j = floor(n/2)

function lerpcolor(a, b, n = 10) {
  let rgbrev = (s) => s.slice(s.indexOf('(') + 1, -1).split(',').map(x => parseInt(x, 10));
  let lerp = (abi) => {
    let ret = new Array(n);
    let ai = abi[0];
    let bi = abi[1];

    // eh blir 1 mer
    for (let i = 0; i <= n; i++) {
      let ni = [0, 0, 0]

      ni[0] = Math.floor((1 - i/n)*ai[0] + (i/n)*bi[0]);
      ni[1] = Math.floor((1 - i/n)*ai[1] + (i/n)*bi[1]);
      ni[2] = Math.floor((1 - i/n)*ai[2] + (i/n)*bi[2]);

      ret[i] = ni;
    }

    return ret;
  }

  let ab = _.zip(a.map(rgbrev), b.map(rgbrev))
      .map(lerp)
      .map(l => l.map(c => rgb(c[0], c[1], c[2])));

  return ab;
}

// lag et ccc.eobject, med en bounceting

const farge = {
  puster: ["#ef3b2c", "#cb181d", "#a50f15", "#a50f15", "#a50f15", "#67000d", "#67000d", "#67000d"],
  piedra: ["#793FCF", "#DF2AAC", "#FF4B80", "#FF885C", "#FFC350", "#F9F871"],
  zapzap: ["#ED5E93", "#FF737F", "#FF916D", "#FFB360"],
  sovsov: ["#ACACAC", "#999CA1", "#828E95", "#6A8086", "#537372", "#43655A"],
  slukna: ["#a1a1a1"]
};

const rgb = (r, g, b) => `rgb(${r}, ${g}, ${b})`
const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`
const grense = (a, x, b) => Math.min(Math.max(x, a), b)
const fargegrense = (x) => grense(0, x, 255);
// const fargefunk = (fff) => ([rgb(0, 0, 0)]).concat(fff.concat(fff.slice(0, -2).reverse()))
const fargefunk = (fff) => fff.concat(fff.slice(0, -1).reverse())
const wowfarge = (fff) => fff.map(() => fff[_.random(fff.length - 1)])
const zapfarge = (fff, lll = 10) => (new Array(lll)).fill("#fff").map((o, i) => fff[_.random(fff.length - 1)])
const repfarge = (fff, lll = 10) => (new Array(lll)).fill("#fff").map((o, i) => (i % (fff.length*2)) === (i % (fff.length)) ?
                                                                      fff[                  i % fff.length ] :
                                                                      fff[fff.length - 1 - (i % fff.length)])

function genfarge(n) {
  let farger = []
  let ri = _.random(0, 255);
  let gi = _.random(0, 255);
  let bi = _.random(0, 255);

  let [ lo,  hi] = [[-100,            -20], [ 20,             100]];
  let [rlo, rhi] = [_.random(lo[0], lo[1]), _.random(hi[0], hi[1])];
  let [glo, ghi] = [_.random(lo[0], lo[1]), _.random(hi[0], hi[1])];
  let [blo, bhi] = [_.random(lo[0], lo[1]), _.random(hi[0], hi[1])];

  for (let i = 0; i < n; i += 1) {
    farger.push(rgb(ri, gi, bi))
    ri = fargegrense(ri + _.random(rlo, rhi));
    gi = fargegrense(gi + _.random(glo, ghi));
    bi = fargegrense(bi + _.random(blo, bhi));
  }

  return farger;
}

const mapkey = (f, o) => Object.keys(o).reduce((ny, k) => {
  ny[k] = f(o[k]);

  return ny;
}, {});

let hvorstor = 6;
let margin   = 6;
var ccc = new Celledings(hvorstor, margin);
const sss = new Sprite(varitsprite, 5, 7, ccc);

const cw = ccc.cw;
const ch = ccc.ch;
const mmm = 20;
const zzz = mmm*2;

var kossfarge = fargefunk(genfarge(zzz));
// var kossfarge = farge.piedra;
// var kossfarge = repfarge(farge.piedra, zzz)
var ifarge = 0;

// ohoi
var r = 19.0;
// const canvas = document.getElementsByTagName("canvas")[0];
// canvas.width  = cw;
// canvas.height = ch;
// canvas.style.width  = cw + "px";
// canvas.style.height = ch + "px";

var sulten = false;
var lerpliste = [];
var istart = 0;
function mere() {
  if (!sulten) {
    //                        ikke vilt stilig
    //                               |
    //                               v
    let a = fargefunk(genfarge(zzz)).slice(0, kossfarge.length);
    let b = kossfarge;

    lerpliste = lerpcolor(a, b, 6);
    sulten = true;
    istart = ifarge;
  }
}

var itest = 0;
function knask() {
  let ifargern = ifarge;
  let tygg = lerpliste[ifargern].pop();

  if (tygg) {
    kossfarge[ifargern] = tygg;
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

// dist fra forrige?
window.addEventListener("mousemove", hvorermusa)
window.addEventListener("keydown", (e) => {
  switch(e.key) {
  case "p": r += 1; break;
  case "o": r -= 1; break;
  case "l": s += 1; break;
  case "k": s -= 1; break;
  case "a": mere(); break;
  }
})

const ctx = canvas.getContext("2d", { alpha: false });
ctx.scale(devicePixelRatio, devicePixelRatio);

const updatefunk = () => {
  ctx.clearRect(0, 0, ccc.cw, ccc.ch);

  for (let i = 0; i < ccc.alle; i += 1) {
    if (ccc.state[i] > 0) {
      ctx.fillStyle = kossfarge[ccc.color[i]];
      ctx.beginPath();
      ctx.arc(ccc.x[i], ccc.y[i], grense(0, ccc.fr[i], ccc.hvorstor), 0, 2*Math.PI);
      // let roar = grense(0, ccc.fr[i], ccc.hvorstor);
      // ctx.rect(ccc.x[i] - roar/2, ccc.y[i] - roar/2, roar, roar)
      ctx.fill();

      ccc.state[i] = 0;
    }
  }
};

let rect = canvas.getBoundingClientRect();

window.addEventListener("mousedown", () => ripplepush(must[0], must[1]))
window.setInterval(
  () => ripplepush(
    _.random(rect.left, rect.right),
    _.random(rect.top,  rect.bottom)
  ),
  1000
)

const velgfunk = (ox, oy) => _.random(1) ?
      (px, py, r, rad) => sirkel(ox, oy, px, py, r, eukdiststabil) :
      (px, py, r, rad) => sirkelrot(ox, oy, px, py, r, mandist, rad)

const ripplemax = 500.0;
const ripplelength = 20;
const ripplefunk = (ox, oy, r = 0) => ({
  f: velgfunk(ox, oy),
  r: r,
  rmax: ripplemax, // _.random(200, ripplemax),
  rot: _.random(10, 300)
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

function geomdingstre(t) {
  let nais = t/600.0;

  for (let i = 0; i < ccc.state.length; i += 1) {
    for (let irip = 0; irip < ripplelength; irip += 1) {
      let rip = ripple[irip];

      if (rip.r < rip.rmax) {
        let rrot = (-1)**rip.rot*nais*10.0/(rip.rot + 1.0);
        let ra = rip.r;
        let rb = rip.r - 300.0*(((rip.rmax - rip.r)/(rip.rmax))**2)
        let x = rip.f(ccc.fx[i], ccc.fy[i], ra, rrot)
        let y = rip.f(ccc.fx[i], ccc.fy[i], rb, rrot)
        let c = cut(x, y);

        if (c <= 0.0) {
          ccc.fr[i] = -c;
          
          if (ccc.state[i] === 1) {
            ccc.color[i] = zzz - 1 - (irip % zzz);
            ccc.state[i] = 2;
          } else {
            ccc.color[i] = irip % zzz;
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

function geomdingstsu(t) {
  let [mx, my] = mus.fetch(0);
  let wowx = Math.floor(mx/ccc.total - sss.width/2);
  let wowy = Math.floor(my/ccc.total - sss.height/2);

  sss.draw(wowx, wowy)
}

var s = 0.0;
var oxs = new Uint32Array(mmm);
var oys = new Uint32Array(mmm);
var bredde = 28.0;
function geomdings(t) {
  let nais = t/500.0;
  let rmod = r + 1;
  mus.fyll(oxs, oys);

  for (let k = mmm - 1; k > 0; k -= 1) {
    for (let i = 0; i < ccc.state.length; i += 1) {
      let krot = (-1)**k*nais/(k + 1.0);
      let pr = rot(oxs[mmm - k], oys[mmm - k], ccc.fx[i], ccc.fy[i], krot);
      let x = sirkel(oxs[mmm - k], oys[mmm - k], pr[0], pr[1], k*rmod + 10.0*s + bredde, mandist);
      let y = sirkel(oxs[mmm - k], oys[mmm - k], pr[0], pr[1], k*rmod + 10.0*s,          mandist);
      let c = cut(x, y);

      if (c <= 0.0) {
        ccc.fr[i] = -c;
        
        if (ccc.state[i] === 1) {
          ccc.color[i] = zzz - 1 - ((k + ifarge) % zzz);
          ccc.state[i] = 2;
        } else {
          ccc.color[i] = (k + ifarge) % zzz;
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
function hvorermusa(e) {
  must[0] = e.clientX - rect.left;
  must[1] = e.clientY - rect.top;
}

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

let kuldings = _.random(1) ? geomdings : geomdingstre;
var prev = 0;
var acct = 0;
function animasjon(t) {
  window.requestAnimationFrame(animasjon);

  kuldings(t);
  pushmus();
  updatefunk();

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

window.onresize = () => {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  rect = canvas.getBoundingClientRect();
  ccc = new Celledings(hvorstor, margin);
}
