function Image3d(imagePath, maskPath) {
    this.x = 0;
    this.y = 0;
    
    this.imagePath = imagePath;
    this.img = new Image();
    this.img.src = imagePath;

    this.maskPath = maskPath;
    this.mask = new Image();
    this.mask.src = maskPath;
    
    this.xpos = 0;
    this.ypos = 0;
    this.zpos = 0;

    this.vx = 0;
    this.vy = 0;
    this.vz = 0;

    this.scaleX = 1;
    this.scaleY = 1;

    this.rotation = 0;

    this.visible = true;
}

Image3d.prototype.draw = function (context) {
    context.save();

    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.scale(this.scaleX, this.scaleY);

    context.drawImage(this.img, -(this.img.width/2), -(this.img.height/2), this.img.width, this.img.height);
    context.drawImage(this.mask, -(this.mask.width/2), -(this.mask.height/2), this.mask.width, this.mask.height);

    // let kormang = ((this.zpos/100) | 0)
    // for (let i = 0; i < kormang; i += 1) {
    //         context.drawImage(this.mask, -(this.width/2), -(this.height/2), this.width, this.height);
    // }

    // context.setTransform(1, 0, 0, 1, 0, 0);
    context.restore();
};
