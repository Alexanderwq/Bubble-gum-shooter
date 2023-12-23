export default class Ball {
    constructor(coords, color, radius, active = true) {
        this.coords = coords;
        this.color = color;
        this.radius = radius;
        this.active = active;
    }
    collided(ball) {
        return this.getDistanceBetween(ball) < ball.radius + this.radius;
    }
    getDistanceBetween(ball) {
        const distX = this.coords.x - ball.coords.x;
        const distY = this.coords.y - ball.coords.y;
        return Math.sqrt(distX * distX + distY * distY);
    }
    draw(board) {
        var _a;
        board.getContext().fillStyle = (_a = this.color) !== null && _a !== void 0 ? _a : '';
        board.getContext().beginPath();
        board.getContext().arc(this.coords.x, this.coords.y, this.radius, 0, 2 * Math.PI);
        board.getContext().fill();
    }
}
