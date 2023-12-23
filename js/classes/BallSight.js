import UnitConverter from "../utils/UnitConverter.js";
class BallSight {
    constructor(coords) {
        this.maxRotateRight = UnitConverter.degToRad(60);
        this.maxRotateLeft = UnitConverter.degToRad(-60);
        this.color = 'black';
        this.shootDir = 0;
        this.shootDeg = 0;
        this.coords = coords;
    }
    turnArrow(dir) {
        this.shootDir = dir;
        this.shootDeg = this.shootDeg + UnitConverter.degToRad(2) * this.shootDir;
        if (this.shootDeg <= this.maxRotateLeft) {
            this.shootDeg = this.maxRotateLeft;
        }
        else if (this.shootDeg >= this.maxRotateRight) {
            this.shootDeg = this.maxRotateRight;
        }
    }
    draw(canvas, context) {
        context.save();
        context.translate(this.coords.x, this.coords.y + 70);
        // const dX = mouseX - this.coords.x,
        //     dY = mouseY - this.coords.y - 70;
        // this.rotation = Math.atan2(dY, dX);
        // TODO: Поворачиваем с - 90 градусов, потому что стрелка изначально смотрит вправо
        context.rotate(this.shootDeg - UnitConverter.degToRad(90));
        context.translate((canvas.width / 2) - 80, 0);
        context.fillStyle = this.color;
        context.beginPath();
        context.moveTo(-25, -12.5);
        context.lineTo(0, -12.5);
        context.lineTo(0, -25);
        context.lineTo(25, 0);
        context.lineTo(0, 25);
        context.lineTo(0, 12.5);
        context.lineTo(-50, 12.5);
        context.lineTo(-50, -12.5);
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();
    }
}
/**
 * @public - шаг поворота стрелки
 */
BallSight.rotateStep = 5;
export default BallSight;
