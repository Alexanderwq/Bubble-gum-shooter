import {Coords} from "../types/Coords.js";
import UnitConverter from "../utils/UnitConverter.js";

export default class BallSight {
    /**
     * @public - шаг поворота стрелки
     */
    public static rotateStep: number = 5;

    private maxRotateRight: number = UnitConverter.degToRad(60);
    private maxRotateLeft: number = UnitConverter.degToRad(-60);
    private coords: Coords;
    private color = 'black';
    private shootDir = 0;
    public shootDeg = 0;

    constructor(coords: Coords) {
        this.coords = coords;
    }

    turnArrow(dir: number): void {
        this.shootDir = dir;
        this.shootDeg = this.shootDeg + UnitConverter.degToRad(2) * this.shootDir;

        if (this.shootDeg <= this.maxRotateLeft) {
            this.shootDeg = this.maxRotateLeft
        } else if (this.shootDeg >= this.maxRotateRight) {
            this.shootDeg = this.maxRotateRight
        }
    }

    draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
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