import Board from "./Board.js";
import ShootingBall from "./ShootingBall.js";
import color from "../types/color.js";
import BallSight from "../classes/BallSight.js";
import BallsList from "./BallsList.js";
import Player from "./Player.js";
import { PlayerEvents } from "../types/PlayerEvents.js";
export default class Game {
    constructor(level) {
        this.player = new Player(this.board);
        this.level = level;
        this.board = new Board();
        this.ballsList = new BallsList(this.level, this.board);
        this.shootingBall = new ShootingBall(this.getInitialCoordsShootingBall(), color.red, BallsList.radiusBall);
        this.ballSight = new BallSight({ x: this.board.getCanvas().width / 2, y: 300 });
    }
    init() {
        this.player.init();
        this.player.subscribe(PlayerEvents.arrowLeft, () => this.ballSight.turnArrow(-BallSight.rotateStep));
        this.player.subscribe(PlayerEvents.arrowRight, () => this.ballSight.turnArrow(BallSight.rotateStep));
        this.player.subscribe(PlayerEvents.space, () => {
            this.shootingBall.dX = Math.sin(this.ballSight.shootDeg) * this.shootingBall.speed;
            this.shootingBall.dY = -Math.cos(this.ballSight.shootDeg) * this.shootingBall.speed;
        });
        requestAnimationFrame(() => this.render());
    }
    render() {
        this.board.clear();
        this.board.init();
        this.ballSight.draw(this.board.getCanvas(), this.board.getContext());
        this.ballsList
            .getActiveBalls()
            .forEach((ball) => {
            ball.draw(this.board);
        });
        this.renderShootingBall();
        requestAnimationFrame(() => this.render());
    }
    renderShootingBall() {
        this.shootingBall.draw(this.board);
        this.shootingBall.move();
        this.handleBounceFromWalls();
        if (this.shootingBall.coords.y - this.board.grid / 2 < this.board.wallSize) {
            const closestBubble = this.ballsList.getClosestBubble(this.shootingBall);
            if (closestBubble) {
                this.handleCollision(closestBubble);
                this.ballsList.removeMatch(closestBubble);
                this.ballsList.dropFloatingBubbles();
            }
        }
        this.ballsList
            .getActiveBalls()
            .forEach((ball) => {
            if (this.shootingBall.collided(ball)) {
                const closestBubble = this.ballsList.getClosestBubble(this.shootingBall);
                if (!closestBubble) {
                    alert('Game Over');
                }
                if (closestBubble) {
                    this.handleCollision(closestBubble);
                    this.ballsList.removeMatch(closestBubble);
                    this.ballsList.dropFloatingBubbles();
                }
            }
        });
    }
    handleCollision(closestBubble) {
        const copiedShootingBall = this.shootingBall.getCopy();
        closestBubble.color = copiedShootingBall.color;
        closestBubble.active = true;
        this.shootingBall.setDefaultPosition();
    }
    handleBounceFromWalls() {
        if (this.shootingBall.coords.x - this.board.grid / 2 < this.board.wallSize) {
            this.shootingBall.coords.x = this.board.wallSize + this.board.grid / 2;
            this.shootingBall.dX *= -1;
        }
        else if (this.shootingBall.coords.x + this.board.grid / 2 > this.board.getCanvas().width - this.board.wallSize) {
            this.shootingBall.coords.x = this.board.getCanvas().width - this.board.wallSize - this.board.grid / 2;
            this.shootingBall.dX *= -1;
        }
    }
    getInitialCoordsShootingBall() {
        return {
            x: this.board.getCanvas().width / 2,
            y: this.board.getCanvas().height - this.board.grid * 1.5,
        };
    }
}
