class Labyrint {
    constructor(w, h) {
        this.h = h;
        this.w = w;
        this.grid = new Array(w*h).fill(".");
    }

    // eh
    getfelt(x, y) {
        return this.grid[x*this.w + y];
    }

    setfelt(x, y, c) {
        return this.grid[x*this.w + y] = c;
    }

    strek(a, b) {
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let sign = dy/Math.abs(dy);
        let derr = dy/dx | 0;
        let cerr = 0;
        
        let y = a.y;
        
        for (let x = a.x; x <= b.x; x += 1) {
            setfelt(x, y, "#");
            cerr += derr;

            if (cerr >= 0.5) {
                y += sign;
            }
        }
    }
}

class Tusle {
    constructor(lab) {
        this.lab = lab;
        this.x = 0;
        this.y = 0;
    }
}

const bresenham = (l, x1, y1, x2, y2) => {
    
}

// knotealgo
const halv  = (x, y, p)    => y - p
const strek = (x, y, p, b) => cut(halv(p - b/2, x, y), halv(p + b/2, x, y))
