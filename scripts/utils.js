
/**
 * Checks if the mouse is inside a defined border
 * @param {object} mouse 
 * @param {number} x 
 * @param {number} w 
 * @param {number} y 
 * @param {number} h 
 * @returns 
 */
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

/**
 * Wraps a text (as the name suggests) so it doesn't go out of bounds
 * @param {string} text 
 * @param {number} maxWidth 
 * @returns {object}
 */
export function wrapTextLines(text, maxWidth) {
    if (!text) return [];
    const words = text.split(" ");
    let line = "";
    const lines = [];

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth && i > 0) {
            lines.push(line.trim());
            line = words[i] + " ";
        } else {
            line = testLine;
        }
    }

    lines.push(line.trim());
    console.log(typeof(lines))
    return lines;
}