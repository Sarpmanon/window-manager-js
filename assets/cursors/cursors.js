const drawable_cursors = {
    default: {
        pixels: [
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
            [1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
            [1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
            [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
            [1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
            [1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
            [1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1],
            [1, 2, 2, 1, 2, 2, 1, 0, 0, 0, 0],
            [1, 2, 1, 0, 1, 2, 2, 1, 0, 0, 0],
            [1, 1, 0, 0, 1, 2, 2, 1, 0, 0, 0],
            [1, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0],
            [0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0]
        ],
        colormap: {
            2: "#000",
            1: "#fff",
            0: null,
        }
    },
    text: {
        pixels: [
            [1, 1, 0, 0, 0, 1, 1],
            [0, 0, 1, 0, 1, 0, 0],
            [0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0],
            [0, 0, 1, 0, 1, 0, 0],
            [1, 1, 0, 0, 0, 1, 1],
        ],
        colormap: {
            1: "#000",
            0: null,
        }
    }
}

function createSpriteImage(image, colormap, pixelsize = 1, x, y) {
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

export const all_cursors = {
    default: createSpriteImage(drawable_cursors.default.pixels, drawable_cursors.default.colormap, 1, 150, 150),
    text: createSpriteImage(drawable_cursors.text.pixels, drawable_cursors.text.colormap, 1, 150, 150)
}