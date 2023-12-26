import color from "../types/color.js";
import getRandomInt from "../utils/getRandomInt.js";

export default class Level {
    private static countRows: number = 4;

    static getBalls() {
        let lvl: color[][] = Array(this.countRows).fill([])

        return lvl.map((array: color[], index: number) => {
            const getRandomColor: Function = () => Object.keys(color)[getRandomInt(0, Object.keys(color).length - 1)]
            if (index % 2 !== 0) {
                array = Array(7).fill(null).map(() => getRandomColor())
            } else {
                array = Array(8).fill(null).map(() => getRandomColor())
            }
            return array;
        })
    }
}