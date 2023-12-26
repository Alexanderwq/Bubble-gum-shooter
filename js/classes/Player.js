import { PlayerEvents } from "../types/PlayerEvents.js";
export default class Player {
    constructor(board) {
        this.listeners = {
            [PlayerEvents.arrowLeft]: [],
            [PlayerEvents.space]: [],
            [PlayerEvents.arrowRight]: [],
        };
        this.board = board;
    }
    init() {
        document.addEventListener('keydown', (e) => {
            if (e.code === PlayerEvents.arrowLeft) {
                this.notifySubscribers(PlayerEvents.arrowLeft, e);
            }
            else if (e.code === PlayerEvents.arrowRight) {
                this.notifySubscribers(PlayerEvents.arrowRight, e);
            }
            if (e.code === PlayerEvents.space) {
                this.notifySubscribers(PlayerEvents.space, e);
            }
        });
    }
    subscribe(event, callback) {
        this.listeners[event].push(callback);
    }
    notifySubscribers(event, data = null) {
        this.listeners[event].forEach((callback) => callback(data));
    }
}
