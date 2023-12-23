import {PlayerEvents} from "./PlayerEvents";

export type PlayerListeners = {
    [key in PlayerEvents]: Function[]
}
