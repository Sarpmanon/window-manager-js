/**
 * Creates sprite images that makes it possible to convert arrays into real usable images inside the project
 * @param {Array} image 
 * @param {Object} colormap 
 * @param {number} pixelsize 
 * @param {number} x 
 * @param {number} y 
 * @returns {*}
 */
export function createSpriteImage(image, colormap, pixelsize = 1, x, y) {
    const w = image[0].length * pixelsize;
    const h = image.length * pixelsize;

    const canv = document.createElement("canvas")
    canv.width = w;
    canv.height = h;
    const ctx = canv.getContext("2d")

    for (let y = 0; y < image.length; y++) {
        for (let x = 0; x < image[y].length; x++) {
            const pix = image[y][x]
            const color = colormap[pix];

            if (color === null || color === undefined) continue;

            ctx.fillStyle = color;
            ctx.fillRect(
                x * pixelsize,
                y * pixelsize,
                pixelsize,
                pixelsize
            )
        }
    }

    return canv;
}
