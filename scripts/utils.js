
export function inRect(mouse, x, w, y, h) {
    if (mouse == undefined || x == undefined || w == undefined || y == undefined || h == undefined) {
        throw new Error(`Missing parameter in inRect`)
    }

    return mouse.x >= x && mouse.y >= y && mouse.x < x + w && mouse.y < y + h;
}

export function sleep(ms) {
    let start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > ms) {
            break;
        }
    }
}