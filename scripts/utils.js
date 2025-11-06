
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

CanvasRenderingContext2D.prototype.strokeRoundedRect = function(x = 0, y = 0, w = 150, h = 100, radius, color) {
    this.strokeStyle = color || "#000"
    this.beginPath();
    this.roundRect(x, y,  w, h, radius)
    this.stroke(); //change to this.fill() for it to fill all the square
}