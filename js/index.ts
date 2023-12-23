import Game from './classes/Game.js'
import color from './types/color.js'

const levelOne: color[][] = [
    [color.red, color.red, color.yellow, color.yellow, color.blue, color.blue, color.gray, color.gray,],
    [color.red, color.red, color.yellow, color.yellow, color.red, color.blue, color.gray,],
    [color.blue, color.blue, color.gray, color.gray, color.red, color.red, color.yellow, color.yellow],
    [color.blue, color.gray, color.gray, color.red, color.red, color.yellow, color.yellow],
];

(new Game(levelOne)).init()