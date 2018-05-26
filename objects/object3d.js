function Object3d(xpos, ypos, radius, color) {
    this.x = 0;
    this.y = 0;
    this.baseRadius = radius;
    this.radius = radius;
    this.color = color;
    this.colorIndex = 0;

    this.xpos = xpos;
    this.ypos = ypos;
    this.zpos = 1500;

    this.vx = 0;
    this.vy = 0;
    this.vz = -5;

    this.scaleX = 1;
    this.scaleY = 1;

    this.rotation = 0;

    this.visible = true;
}

Object3d.prototype.draw = function (context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.scale(this.scaleX, this.scaleY);

    context.fillStyle = this.color;
    context.beginPath();
    //x, y, radius, start_angle, end_angle, anti-clockwise
    context.arc(0, 0, this.radius, 0, (Math.PI * 2), true);
    context.closePath();
    context.fill();
    context.restore();
};