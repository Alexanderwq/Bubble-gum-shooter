/**
 * @class UnitConverter - Конвертер величин
 */
export default class UnitConverter {
    public static degToRad(deg: number): number {
        return (deg * Math.PI) / 180;
    }
}