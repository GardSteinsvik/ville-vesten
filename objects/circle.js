function Circle(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.baseRadius = radius;
    this.radius = radius;
    this.color = color;
}

Circle.prototype.draw = function (context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fillStyle = this.color;
    context.fill();
};
