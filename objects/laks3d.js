Laks3d.laksColorList = [
    'cyanlaks.png',
    'rødlaks.png',
    'gullaks.png',
    'grønnlaks.png',
    'rosalaks.png'
];

function Laks3d() {
    this.x = 0;
    this.y = 0;

    this.img = new Image();
    this.img.src = 'images/laks/laks.png';

    this.mask = new Image();
    const colorIndex = Math.floor(Math.random() * Laks3d.laksColorList.length);
    this.mask.src = 'images/laks/' + Laks3d.laksColorList[colorIndex];

    this.xpos = 0;
    this.ypos = 0;
    this.zpos = 0;

    this.vx = 0;
    this.vy = 0;
    this.vz = 0;

    this.scaleX = 1;
    this.scaleY = 1;

    this.rotation = 0;
    this.skewFactor = 0;

    this.visible = true;
}

Laks3d.prototype.draw = function (context) {
    context.save();

    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.scale(this.scaleX, this.scaleY);
    context.transform(1,this.skewFactor,-this.skewFactor,1,0,0);

    context.drawImage(this.img, -(this.img.width/2), -(this.img.height/2), this.img.width, this.img.height);
    context.drawImage(this.mask, -(this.mask.width/2), -(this.mask.height/2), this.mask.width, this.mask.height);

    // let kormang = ((this.zpos/100) | 0)
    // for (let i = 0; i < kormang; i += 1) {
    //         context.drawImage(this.mask, -(this.width/2), -(this.height/2), this.width, this.height);
    // }

    // context.setTransform(1, 0, 0, 1, 0, 0);
    context.restore();
};
