import Ball from "./Ball.js";
import Board from "./Board.js";
import color from "../types/color.js";
import UnitConverter from "../utils/UnitConverter.js";
import {Coords} from "../types/Coords.js";
import Level from "./Level.js";

/**
 * @class BallsList - Класс со всеми шарами (сетка)
 */
export default class BallsList {
    public static radiusBall = 16;
    private readonly board: Board;
    private readonly level: string[][];
    public balls: Ball[];
    private listeners: Function[] = [];

    constructor(level: string[][], board: Board) {
        this.board = board;
        this.level = level;
        this.balls = this.setBalls()
    }

    subscribe(callback: Function): void {
        this.listeners.push(callback)
    }

    notify(): void {
        this.listeners.forEach((callback: Function) => callback())
    }

    getCountActiveRows(): number {
        return Math.floor(this.balls.length / 7.5)
    }

    public getActiveBalls(): Ball[] {
        return this.balls.filter((ball: Ball) => ball.active);
    }

    public getClosestBubble(ball: Ball, active: boolean = false): Ball | null {
        const closestBubbles = this.balls
            .filter((bubble: Ball) => bubble.active === active && ball.collided(bubble));

        if (!closestBubbles.length) {
            return null;
        }

        return closestBubbles
            .map(bubble => {
                return {
                    distance: ball.getDistanceBetween(bubble),
                    bubble
                }
            })
            .sort((a, b) => a.distance - b.distance)[0].bubble;
    }

    addRowToBegin(): void {
        this.balls.forEach(ball => {
            ball.coords.y += (BallsList.radiusBall * 2) + this.board.gridGap - 4;
        })
        this.balls = [...this.createRow(), ...this.balls]
    }

    private createRow(): Ball[] {
        const isEven = !Boolean(this.getCountActiveRows() % 2);
        let colors: string[] = Level.getRow(isEven);

        return colors.map((color: string, index: number) => {
            return this.createBall(isEven, 0, index, color)
        })
    }

    getMatches(balls: Ball[], excludeBalls: Ball[] = []): Ball[] {
        balls.forEach((ball: Ball) => {
            balls = [...balls, ...this.getNeighborsByColor(ball)]
        })

        balls = this.removeDuplicates(balls)

        balls = balls.filter((ball) => {
            return !excludeBalls.find((excludeBall: Ball) => excludeBall.coords.x === ball.coords.x && excludeBall.coords.y === ball.coords.y)
        })

        excludeBalls = [...excludeBalls, ...balls]

        if (balls.length !== 0) {
            return this.getMatches(balls, excludeBalls)
        }

        return excludeBalls
    }

    private removeDuplicates(balls: Ball[]): Ball[] {
        return balls.filter((ball: Ball, index: number, self: Ball[]) => {
            return index === self.findIndex((b: Ball) => (
                b.coords.x === ball.coords.x && b.coords.y === ball.coords.y
            ))
        })
    }

    public removeMatch(targetBubble: Ball): void {
        const MIN_MATCHES: number = 3;

        let neighbors: Ball[] = this.getMatches([targetBubble])

        if (neighbors.length >= MIN_MATCHES) {
            neighbors.forEach(bubble => {
                bubble.active = false;
            });
            this.notify();
        }
    }

    private createBall(isEven: boolean, row: number, col: number, color: string|null): Ball {
        // для нечетных строк с шарами нужно немного изменить местоположение
        const startX = isEven ? 0 : 0.5 * this.board.grid;

        // что бы позиционирование было не от левого края, а по центру шара
        const center = this.board.grid / 2;

        const coords: Coords = {
            x: this.board.wallSize + (this.board.grid + this.board.gridGap) * col + startX + center,
            y: this.board.wallSize + (this.board.grid + this.board.gridGap - 4) * row + center,
        }
        return new Ball(
            coords,
            color,
            BallsList.radiusBall,
            !!color,
        )
    }

    private setBalls(): Ball[] {
        let balls: Ball[] = []

        const rows = this.board.getCountRows()
        const columns = this.board.getCountColumns()

        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            for (let colIndex = 0; colIndex < (rowIndex % 2 === 0 ? columns : columns + 1); colIndex++) {
                const colorBall = this.level[rowIndex]?.[colIndex];
                const row = Math.floor(rowIndex);
                const col = Math.floor(colIndex);
                const isEven = !Boolean(row % 2)

                balls.push(this.createBall(isEven, row, col, colorBall ?? null))
            }
        }

        return balls;
    }

    private getNeighbors(bubble: Ball): Ball[] {
        const dirs: Coords[] = [
            // right
            this.rotatePoint(this.board.grid, 0, 0),
            // up-right
            this.rotatePoint(this.board.grid, 0, UnitConverter.degToRad(60)),
            // up-left
            this.rotatePoint(this.board.grid, 0, UnitConverter.degToRad(120)),
            // left
            this.rotatePoint(this.board.grid, 0, UnitConverter.degToRad(180)),
            // down-left
            this.rotatePoint(this.board.grid, 0, UnitConverter.degToRad(240)),
            // down-right
            this.rotatePoint(this.board.grid, 0, UnitConverter.degToRad(300))
        ];

        let neighbors: Ball[] = []
        dirs.forEach(dir => {
            const bubbleCoords: Coords = {
                x: bubble.coords.x + dir.x,
                y: bubble.coords.y + dir.y,
            }
            const newBubble = new Ball(
                bubbleCoords,
                null,
                bubble.radius,
            )
            const neighbor = this.getClosestBubble(newBubble, true);
            if (neighbor) {
                neighbors.push(neighbor)
            }
        })

        return neighbors
    }

    private getNeighborsByColor(bubble: Ball) {
        return this.getNeighbors(bubble).filter((ball: Ball) => ball.color === bubble.color)
    }

    private rotatePoint(x: number, y: number, angle: number): Coords {
        let sin = Math.sin(angle);
        let cos = Math.cos(angle);

        return {
            x: x * cos - y * sin,
            y: x * sin + y * cos
        };
    }

    dropFloatingBubbles() {
        const activeBubbles = this.getActiveBalls()

        let neighbors = activeBubbles
            .filter(bubble => bubble.coords.y - this.board.grid <= this.board.wallSize);

        for (let i: number = 0; i < neighbors.length; i++) {
            let neighbor: Ball = neighbors[i];

            neighbors = this.removeDuplicates(neighbors.concat(this.getNeighbors(neighbor)))
        }

        // сбрасываем все шары
        activeBubbles
            .forEach((bubble: Ball) => {
                bubble.active = false;
            });

        // оставляем только, те шары которые имеют соседей, т.е. не висят в воздухе
        neighbors
            .forEach((bubble: Ball) => {
                bubble.active = true;
            });
    }
}