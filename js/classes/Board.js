import BallsList from "./BallsList.js";
export default class Board {
    constructor() {
        /**
         * @public - Ширина стен
         */
        this.wallSize = 4;
        /**
         * @public - Расстояние между шарами
         */
        this.gridGap = 5;
        /**
         * @public - Размер сетки
         */
        this.grid = 32;
        this.colorBorder = 'lightgray';
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
    }
    init() {
        this.drawBorders();
    }
    getCountRows() {
        return Math.floor((this.getCanvas().height - (this.getCanvas().height / (BallsList.radiusBall * 2) * this.gridGap)) / (BallsList.radiusBall * 2));
    }
    getCountColumns() {
        return Math.ceil((this.getCanvas().width - (this.getCanvas().width / (BallsList.radiusBall * 2) * this.gridGap)) / (BallsList.radiusBall * 2));
    }
    getCanvas() {
        return this.canvas;
    }
    getContext() {
        return this.context;
    }
    drawBorders() {
        this.context.fillStyle = this.colorBorder;
        this.context.fillRect(0, 0, this.canvas.width, this.wallSize);
        this.context.fillRect(0, 0, this.wallSize, this.canvas.height);
        this.context.fillRect(this.canvas.width - this.wallSize, 0, this.wallSize, this.canvas.height);
        this.context.fillRect(0, 387, this.canvas.width, this.wallSize);
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
