import Game from './classes/Game.js'
import Level from "./classes/Level.js";

const level = Level.getBalls();

(new Game(level)).init()