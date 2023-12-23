import Ball from "./Ball.js";
import color from "../types/color.js";
import getRandomInt from "../utils/getRandomInt.js";
import deepClone from "../utils/deepClone.js";
export default class ShootingBall extends Ball {
    constructor(coords, color, radius, speed = 8, dX = 0, dY = 0) {
        super(coords, color, radius);
        this.speed = speed;
        this.dX = dX;
        this.dY = dY;
        this.shootDir = 0;
        this.initialCoords = deepClone(coords);
    }
    getCopy() {
        return deepClone(this);
    }
    move() {
        this.coords.x += this.dX;
        this.coords.y += this.dY;
    }
    setDefaultPosition() {
        this.dX = 0;
        this.dY = 0;
        this.coords.x = this.initialCoords.x;
        this.coords.y = this.initialCoords.y;
        this.color = Object.keys(color)[getRandomInt(0, Object.keys(color).length - 1)];
    }
}
