import Ball from "./Ball.js";
import {Coords} from "../types/Coords.js";
import color from "../types/color.js";
import getRandomInt from "../utils/getRandomInt.js";
import deepClone from "../utils/deepClone.js";

export default class ShootingBall extends Ball {
    /**
     * @public - Скорость шара
     */
    public speed: number;

    /**
     * @public - Направление при передвижении
     */
    public dX: number;
    public dY: number;

    /**
     * @public - Направление при выстреле
     */
    public shootDir: number;

    /**
     * @private - Начальные координаты
     */
    private initialCoords: Coords;

    constructor(
        coords: Coords,
        color: string,
        radius: number,
        speed: number = 8,
        dX: number = 0,
        dY: number = 0,
    ) {
        super(coords, color, radius);
        this.speed = speed;
        this.dX = dX;
        this.dY = dY;
        this.shootDir = 0;
        this.initialCoords = <Coords>deepClone(coords)
    }

    getCopy(): ShootingBall {
        return deepClone(this) as ShootingBall
    }

    move(): void {
        this.coords.x += this.dX;
        this.coords.y += this.dY;
    }

    setDefaultPosition() {
        this.dX = 0;
        this.dY = 0;
        this.coords.x = this.initialCoords.x;
        this.coords.y = this.initialCoords.y;
        this.color = Object.keys(color)[getRandomInt(0, Object.keys(color).length - 1)]
    }
}