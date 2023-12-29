import color from "../types/color.js";
import getRandomInt from "../utils/getRandomInt.js";

export default class Level {
    private static countRows: number = 4;
    private static evenRowCount: number = 8;
    private static oddRowCount: number = 7;

    static getBalls() {
        let lvl: string[][] = Array(this.countRows).fill([])

        return lvl.map((array: string[], index: number) => {
            if (index % 2 !== 0) {
                array = Array(this.oddRowCount).fill(null).map(() => Level.getRandomColor())
            } else {
                array = Array(this.evenRowCount).fill(null).map(() => Level.getRandomColor())
            }
            return array;
        })
    }

    static getRow(isEven: boolean) {
        const count = isEven ? this.evenRowCount : this.oddRowCount
        return Array(count).fill(null).map(() => Level.getRandomColor())
    }

    static getRandomColor(): string {
        return Object.keys(color)[getRandomInt(0, Object.keys(color).length - 1)]

    }
}