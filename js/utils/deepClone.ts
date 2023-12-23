export default function deepClone(object: object): object {
    // TODO: заменить на нормальный deepClone
    return JSON.parse(JSON.stringify(object));
}