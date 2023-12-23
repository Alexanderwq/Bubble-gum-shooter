import {Coords} from "../types/Coords.js";
import Board from "./Board.js";

export default class Ball {
    coords: Coords;
    color: string | null;
    radius: number;
    active: boolean;

    constructor(coords: Coords, color: string | null, radius: number, active: boolean = true) {
        this.coords = coords;
        this.color = color;
        this.radius = radius;
        this.active = active;
    }

    collided(ball: Ball): boolean {
        return this.getDistanceBetween(ball) < ball.radius + this.radius;
    }

    getDistanceBetween(ball: Ball): number {
        const distX = this.coords.x - ball.coords.x;
        const distY = this.coords.y - ball.coords.y;
        return Math.sqrt(distX * distX + distY * distY);
    }

    draw(board: Board): void {
        board.getContext().fillStyle = this.color ?? '';
        board.getContext().beginPath();
        board.getContext().arc(this.coords.x, this.coords.y, this.radius, 0, 2 * Math.PI);
        board.getContext().fill();
    }
}