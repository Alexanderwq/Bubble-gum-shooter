import {Coords} from "../types/Coords";
import Board from "./Board";
import {PlayerEvents} from "../types/PlayerEvents.js";
import {PlayerListeners} from "../types/PlayerListeners";

export default class Player {
    /**
     * @private - Координаты мышки пользователя (пока не используется)
     */
    // private coords: Coords;

    private board: Board;

    private listeners: PlayerListeners = {
        [PlayerEvents.arrowLeft]: [],
        [PlayerEvents.space]: [],
        [PlayerEvents.arrowRight]: [],
    }

    constructor(board: Board) {
        this.board = board;
    }

    public init(): void {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.code === PlayerEvents.arrowLeft) {
                this.notifySubscribers(PlayerEvents.arrowLeft, e)
            }
            else if (e.code === PlayerEvents.arrowRight) {
                this.notifySubscribers(PlayerEvents.arrowRight, e)
            }
            if (e.code === PlayerEvents.space) {
                this.notifySubscribers(PlayerEvents.space, e)
            }
        });
    }

    public subscribe(event: PlayerEvents, callback: Function): void {
        this.listeners[event].push(callback)
    }

    public notifySubscribers(event: string, data: any = null): void {
        (this.listeners as Record<string, Function[]>)[event].forEach((callback: Function) => callback(data))
    }

    // TODO: на будущее
    // private getMousePos(e: MouseEvent): void {
    //     const rect = this.board.getCanvas().getBoundingClientRect();
    //     this.coords.y = Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*this.board.getCanvas().height)
    //     this.coords.x = Math.round((e.clientX - rect.left)/(rect.right - rect.left)*this.board.getCanvas().width)
    // }
}