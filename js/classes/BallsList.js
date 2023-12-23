import Ball from "./Ball.js";
import UnitConverter from "../utils/UnitConverter.js";
/**
 * @class BallsList - Класс со всеми шарами (сетка)
 */
class BallsList {
    constructor(level, board) {
        this.board = board;
        this.level = level;
        this.balls = this.setBalls();
    }
    getActiveBalls() {
        return this.balls.filter((ball) => ball.active);
    }
    getClosestBubble(ball, active = false) {
        const closestBubbles = this.balls
            .filter((bubble) => bubble.active === active && ball.collided(bubble));
        if (!closestBubbles.length) {
            return null;
        }
        return closestBubbles
            .map(bubble => {
            return {
                distance: ball.getDistanceBetween(bubble),
                bubble
            };
        })
            .sort((a, b) => a.distance - b.distance)[0].bubble;
    }
    getMatches(balls, excludeBalls = []) {
        balls.forEach((ball) => {
            balls = [...balls, ...this.getNeighborsByColor(ball)];
        });
        balls = this.removeDuplicates(balls);
        balls = balls.filter((ball) => {
            return !excludeBalls.find((excludeBall) => excludeBall.coords.x === ball.coords.x && excludeBall.coords.y === ball.coords.y);
        });
        excludeBalls = [...excludeBalls, ...balls];
        if (balls.length !== 0) {
            return this.getMatches(balls, excludeBalls);
        }
        return excludeBalls;
    }
    removeDuplicates(balls) {
        return balls.filter((ball, index, self) => {
            return index === self.findIndex((b) => (b.coords.x === ball.coords.x && b.coords.y === ball.coords.y));
        });
    }
    removeMatch(targetBubble) {
        const MIN_MATCHES = 3;
        let neighbors = this.getMatches([targetBubble]);
        if (neighbors.length >= MIN_MATCHES) {
            neighbors.forEach(bubble => {
                bubble.active = false;
            });
        }
    }
    setBalls() {
        var _a;
        let balls = [];
        const rows = this.board.getCountRows();
        const columns = this.board.getCountColumns();
        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            for (let colIndex = 0; colIndex < (rowIndex % 2 === 0 ? columns : columns + 1); colIndex++) {
                const colorBall = (_a = this.level[rowIndex]) === null || _a === void 0 ? void 0 : _a[colIndex];
                const row = Math.floor(rowIndex);
                const col = Math.floor(colIndex);
                // для нечетных строк с шарами нужно немного изменить местоположение
                const startX = row % 2 === 0 ? 0 : 0.5 * this.board.grid;
                // что бы позиционирование было не от левого края, а по центру шара
                const center = this.board.grid / 2;
                const coords = {
                    x: this.board.wallSize + (this.board.grid + this.board.gridGap) * col + startX + center,
                    y: this.board.wallSize + (this.board.grid + this.board.gridGap - 4) * row + center,
                };
                balls.push(new Ball(coords, colorBall !== null && colorBall !== void 0 ? colorBall : null, BallsList.radiusBall, !!colorBall));
            }
        }
        return balls;
    }
    getNeighbors(bubble) {
        const dirs = [
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
        let neighbors = [];
        dirs.forEach(dir => {
            const bubbleCoords = {
                x: bubble.coords.x + dir.x,
                y: bubble.coords.y + dir.y,
            };
            const newBubble = new Ball(bubbleCoords, null, bubble.radius);
            const neighbor = this.getClosestBubble(newBubble, true);
            if (neighbor) {
                neighbors.push(neighbor);
            }
        });
        return neighbors;
    }
    getNeighborsByColor(bubble) {
        return this.getNeighbors(bubble).filter((ball) => ball.color === bubble.color);
    }
    rotatePoint(x, y, angle) {
        let sin = Math.sin(angle);
        let cos = Math.cos(angle);
        return {
            x: x * cos - y * sin,
            y: x * sin + y * cos
        };
    }
    dropFloatingBubbles() {
        const activeBubbles = this.getActiveBalls();
        let neighbors = activeBubbles
            .filter(bubble => bubble.coords.y - this.board.grid <= this.board.wallSize);
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];
            neighbors = this.removeDuplicates(neighbors.concat(this.getNeighbors(neighbor)));
        }
        // сбрасываем все шары
        activeBubbles
            .forEach((bubble) => {
            bubble.active = false;
        });
        // оставляем только, те шары которые имеют соседей, т.е. не висят в воздухе
        neighbors
            .forEach((bubble) => {
            bubble.active = true;
        });
    }
}
BallsList.radiusBall = 16;
export default BallsList;
