import Board from "./Board.js";
import Ball from "./Ball.js";
import ShootingBall from "./ShootingBall.js";
import color from "../types/color.js";
import BallSight from "../classes/BallSight.js";
import BallsList from "./BallsList.js";
import {Coords} from "../types/Coords.js";
import Player from "./Player.js";
import {PlayerEvents} from "../types/PlayerEvents.js";

export default class Game {
    /**
     * @private - Максимальное количество промахов (при которых добавляется строка)
     */
    private static MAX_MISSES = 5;

    /**
     * @private - Класс игрока
     */
    private player: Player;

    /**
     * @private - Класс доски
     */
    private readonly board: Board;

    /**
     * @private - Общий список шаров
     */
    private ballsList: BallsList;

    /**
     * @private - Стреляющий шар
     */
    private readonly shootingBall: ShootingBall;

    /**
     * @private - Шары для первоначальной отрисовки
     */
    private readonly level: string[][];

    private ballSight: BallSight;

    /**
     * @private - Количество промахов
     */
    private numberMisses: number = 0;

    constructor(level: string[][]) {
        this.level = level;
        this.board = new Board();
        this.player = new Player(this.board);
        this.ballsList = new BallsList(this.level, this.board);
        this.shootingBall = new ShootingBall(
            this.getInitialCoordsShootingBall(),
            color.red,
            BallsList.radiusBall,
        );
        this.ballSight = new BallSight({x: this.board.getCanvas().width / 2, y: 300})
    }

    init(): void {
        this.player.init();

        this.player.subscribe(PlayerEvents.arrowLeft, () => this.ballSight.turnArrow(-BallSight.rotateStep))
        this.player.subscribe(PlayerEvents.arrowRight, () => this.ballSight.turnArrow(BallSight.rotateStep))
        this.player.subscribe(PlayerEvents.space, () => {
            this.shootingBall.dX = Math.sin(this.ballSight.shootDeg) * this.shootingBall.speed;
            this.shootingBall.dY = -Math.cos(this.ballSight.shootDeg) * this.shootingBall.speed;

            this.numberMisses += 1;
        })

        this.ballsList.subscribe(() => this.handleMatch());

        requestAnimationFrame(() => this.render())
    }

    render(): void {
        this.board.clear();
        this.board.init();
        this.ballSight.draw(this.board.getCanvas(), this.board.getContext())
        this.ballsList
            .getActiveBalls()
            .forEach((ball: Ball) => {
                ball.draw(this.board)
            });
        this.renderShootingBall()

        requestAnimationFrame(() => this.render());
    }

    renderShootingBall(): void {
        this.shootingBall.draw(this.board)
        this.shootingBall.move()
        this.handleBounceFromWalls()

        if (this.shootingBall.coords.y - this.board.grid / 2 < this.board.wallSize) {
            const closestBubble = this.ballsList.getClosestBubble(this.shootingBall);
            if (closestBubble) {
                this.handleCollision(closestBubble);
            }
        }

        this.ballsList
            .getActiveBalls()
            .forEach((ball: Ball) => {
                if (this.shootingBall.collided(ball)) {
                    const closestBubble = this.ballsList.getClosestBubble(this.shootingBall);
                    if (!closestBubble)  {
                        alert('Game Over');
                    }

                    if (closestBubble) {
                        this.handleCollision(closestBubble);
                    }
                }
            })
    }

    handleMatch() {
        this.numberMisses = 0
    }

    handleCollision(closestBubble: Ball) {
        const copiedShootingBall: ShootingBall = this.shootingBall.getCopy()

        closestBubble.color = copiedShootingBall.color
        closestBubble.active = true
        this.shootingBall.setDefaultPosition()

        this.ballsList.removeMatch(closestBubble)
        this.ballsList.dropFloatingBubbles()

        if (this.numberMisses === Game.MAX_MISSES) {
            this.ballsList.addRowToBegin();
            this.numberMisses = 0;
        }
    }

    handleBounceFromWalls() {
        if (this.shootingBall.coords.x - this.board.grid / 2 < this.board.wallSize) {
            this.shootingBall.coords.x = this.board.wallSize + this.board.grid / 2;
            this.shootingBall.dX *= -1;
        } else if (this.shootingBall.coords.x + this.board.grid / 2 > this.board.getCanvas().width - this.board.wallSize) {
            this.shootingBall.coords.x = this.board.getCanvas().width - this.board.wallSize - this.board.grid / 2;
            this.shootingBall.dX *= -1;
        }
    }

    getInitialCoordsShootingBall(): Coords {
        return {
            x: this.board.getCanvas().width / 2,
            y: this.board.getCanvas().height - this.board.grid * 1.5,
        }
    }
}