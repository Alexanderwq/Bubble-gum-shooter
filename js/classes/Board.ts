import Ball from "./Ball.js";
import BallsList from "./BallsList.js";

export default class Board {
    /**
     * @public - Ширина стен
     */
    readonly wallSize: number = 4;

    /**
     * @public - Расстояние между шарами
     */
    public readonly gridGap: number = 5;

    /**
     * @public - Размер сетки
     */
    public readonly grid: number = 32;

    private readonly colorBorder: string = 'lightgray';
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;

    constructor() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    }

    init(): void {
        this.drawBorders()
    }

    getCountRows(): number {
        return Math.floor((this.getCanvas().height - (this.getCanvas().height / (BallsList.radiusBall * 2) * this.gridGap)) / (BallsList.radiusBall * 2));
    }

    getCountColumns(): number {
        return Math.ceil((this.getCanvas().width - (this.getCanvas().width / (BallsList.radiusBall * 2) * this.gridGap)) / (BallsList.radiusBall * 2));
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvas as HTMLCanvasElement;
    }

    getContext(): CanvasRenderingContext2D {
        return this.context as CanvasRenderingContext2D;
    }

    drawBorders(): void {
        this.context.fillStyle = this.colorBorder;
        this.context.fillRect(0, 0, this.canvas.width, this.wallSize);
        this.context.fillRect(0, 0, this.wallSize, this.canvas.height);
        this.context.fillRect(this.canvas.width - this.wallSize, 0, this.wallSize, this.canvas.height);
        this.context.fillRect(0, 387, this.canvas.width, this.wallSize);
    }

    clear(): void {
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    }
}