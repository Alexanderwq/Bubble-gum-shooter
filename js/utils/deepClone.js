export default function deepClone(object) {
    // TODO: заменить на нормальный deepClone
    return JSON.parse(JSON.stringify(object));
}
