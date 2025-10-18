import { inRect, sleep } from "./utils.js";
import { canvas, mouse } from "../script.js";

const chc = new FontFace('Chicago', 'url(./assets/fonts/chicago.ttf)')
chc.load().then((loadedfont) => {
    document.fonts.add(loadedfont)
})

class UIElement {
    constructor (x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.visible = true;
    }

    draw(ctx) {}
    update() {}
    click(mx, my) {}
    contains(mx, my) {
        return mx > this.x && mx < this.x + this.w && my > this.y && my < this.y + this.h;
    }
}

export class Button extends UIElement {
    constructor (x, y, w, h, spec, onClick) {
        super(x,y,w,h)
        this.spec = spec;
        this.onClick = onClick;

        this.hover = false;
    }

    updateHover(xPos, yPos) {
        if (
            mouse.x > xPos &&
            mouse.x < xPos + this.w &&
            mouse.y > yPos &&
            mouse.y < yPos + this.h
        ) {
            this.hover = true;
        } else {
            this.hover = false;
        }
    }

    draw(ctx, index, window) {
        if (!this.visible) return;

        let leftPadding = 10;
        let usableWindow = window.w - leftPadding;

        let spacing = 10;
        let fullBoxWidth = this.w + spacing;

        let cols = Math.floor(usableWindow / (fullBoxWidth))

        let col = index % cols
        let row = Math.floor(index / cols)

        let totalPrevHeight = 0;

        for (let i = 0; i < row; i++) {
            const sameRowButtons = window.children.filter((_, idx) => Math.floor(idx / cols) === i)
            const maxH = Math.max(...sameRowButtons.map(b => b.h))
            totalPrevHeight += maxH + spacing * 2.5
        }

        let xPos = (window.x + leftPadding) + col * fullBoxWidth;
        let yPos = (window.y + UIpref.titlebar.h + 10) + totalPrevHeight

        this.updateHover(xPos, yPos)

        if (this.spec.type == "img") {
            // --------------------- Image Type Button ---------------------
            const icon = new Image()
            icon.src = this.spec.src

            if(!this.hover) { ctx.fillStyle = "#fff" } else { ctx.fillStyle = UIpref.button.hoverColor }
            ctx.fillRect(
                xPos,
                yPos,
                this.w, this.h
            )

            ctx.fillStyle = "#000"
            ctx.font = "14px Chicago"
            ctx.fillText(this.spec.alt, xPos, yPos + this.h + 10)

            ctx.drawImage(icon, xPos + (this.w - icon.width) / 2, yPos + (this.h - icon.height) / 2)
        } else if (this.spec.type == "text") {
            // --------------------- Text Type Button ---------------------
            if(!this.hover) { ctx.fillStyle = "#fff" } else { ctx.fillStyle = UIpref.taskbar.menu.hoverColor }

            ctx.fillRect(
                xPos,
                yPos,
                this.w, this.h
            )

            ctx.fillStyle = "#000"
            ctx.font = "14px Chicago"
            ctx.fillText(this.spec.alt, xPos, yPos + this.h / 2)
        }
    }

    click(mx, my) {
        if (
            mx > this.x &&
            mx < this.x + this.w &&
            my > this.y &&
            my < this.y + this.h
        ) {
            this.onClick?.()
        }
    }
}

export class Window extends UIElement {
    constructor(x,y,w,h,title) {
        super(x,y,w,h)
        this.title = title;
        this.children = [];

        windows.push(this)
        this.clicked = false;
    }

    addElement(element) {
        this.children.push(element)
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        //line surrounding it
        ctx.strokeStyle = "rgb(0, 0, 0)"
        ctx.lineWidth = 4
        ctx.strokeRect(Number(this.x) + 1, this.y + 1, this.w, Number(this.h) + Number(UIpref.titlebar.h))

        //window
        ctx.fillStyle = UIpref.window.color
        ctx.fillRect(this.x, Number(this.y) + Number(UIpref.titlebar.h), this.w, this.h)

        //titlebar
        ctx.fillStyle = UIpref.titlebar.color;
        ctx.fillRect(this.x, this.y, this.w, Number(UIpref.titlebar.h))

        ctx.beginPath()
        ctx.lineWidth = 2;
        ctx.moveTo(this.x, this.y + UIpref.titlebar.h)
        ctx.lineTo(this.x + this.w, this.y + UIpref.titlebar.h)
        ctx.stroke();

        //title
        ctx.font = "15px Poppins"
        let title_string = this.title, text_width = ctx.measureText(title_string).width
        ctx.textBaseline = "middle"
        
        ctx.fillStyle = "#000"
        ctx.font = "14px Chicago"
        ctx.fillText(title_string, (this.x + this.w / 2) - text_width / 2, (this.y + UIpref.titlebar.h / 2))

        this.children.forEach((el, index) => el.draw(ctx, index, this))

        //draws the close button
        if (!this.clicked) {
            ctx.strokeStyle = "#000"
            ctx.lineWidth = "2"
            ctx.strokeRect(this.x + 10, this.y + 10, 10, 10)
        } else  {
            ctx.fillStyle = "#000"
            ctx.fillRect(this.x + 10, this.y + 10, 10, 10)
        }
    }

    click(mx, my) {

        // --------------------- Clicks each child ---------------------
        this.children.forEach(el => el.click(mx, my))
        const g = this.getClose()


        // --------------------- Close Button ---------------------
        if (inRect({ x: mx, y: my}, g.x, g.w, g.y, g.h)) {
            this.clicked = true;

            setTimeout(() => {
                this.close();
            }, 50);
        }
    }

    getClose() {
        return { x: this.x + 10, y: this.y + 10, w: 10, h: 10};
    }

    close() {
        const iof = windows.indexOf(this);
        if (iof > -1) windows.splice(iof, 1)
    }
}

export class Taskbar extends UIElement {
    constructor(x,y,w,h) {
        super(x, y, w, h)

        this.items = [];
        this.selectedMenu = -1;
    }

    addElement(element) {
        this.items.push(element)
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        ctx.fillStyle = UIpref.taskbar.color;
        ctx.fillRect(0, 0, window.innerWidth, UIpref.taskbar.h)

        let xPos = 10;
        let yPos = (UIpref.taskbar.h / 2)

        for (let i = 0; i < this.items.length; i++) {
            const taskMenu = this.items[i]

            const textWidth = ctx.measureText(taskMenu.label).width;

            if (inRect({ x: mouse.x, y: mouse.y }, xPos, textWidth, yPos - UIpref.titlebar.h / 2, UIpref.taskbar.h)) {
                ctx.fillStyle = UIpref.taskbar.menu.hoverColor;
                ctx.fillRect(xPos - 10, yPos - UIpref.taskbar.h / 2, textWidth + 20, UIpref.taskbar.h)

                if (mouse.down) {
                    if (this.selectedMenu == i) {
                        this.selectedMenu = -1;
                    } else {
                        this.selectedMenu = i;
                    }
                    mouse.down = false;
                }
            }
            
            if (this.selectedMenu != -1 && this.selectedMenu == i) {
                this.drawSubMenu(xPos - 10, UIpref.titlebar.h, textWidth + 20, UIpref.taskbar.h, i, ctx); this.selectedMenu = i
            };

            ctx.fillStyle = "#000"
            ctx.font = "14px Chicago"
            ctx.textBaseline = "middle"
            ctx.fillText(taskMenu.label, xPos, yPos)

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.moveTo(0, UIpref.taskbar.h)
            ctx.lineTo(canvas.width, UIpref.taskbar.h)
            ctx.stroke()

            xPos += textWidth + UIpref.taskbar.spacing;
        }
    }

    drawSubMenu(xPos, yPos, w, h, index, ctx) {
        let xP = xPos;
        let yP = yPos;

        // finds the longest width of a text
        const submenu = this.items[index].submenu;
        const maxWidth = Math.max(...submenu.map(text => ctx.measureText(text).width));

        const numberOfItems = this.items[index].submenu.length;

        for (let i = 0; i < submenu.length; i++) {
            const text = submenu[i];
            yP = yPos + ((h + 10) * i);

            // bg

            if(inRect({ x: mouse.x, y: mouse.y }, xP, maxWidth + 20, yP, h + 10)) {
                this.subMenuHover(xP, yP, maxWidth + 20, h + 10, ctx)
                mouse.target = "button"
            } else {
                ctx.fillStyle = "#f0f0f0";
                ctx.fillRect(xP, yP, maxWidth + 20, h + 10);
                mouse.target = null
            }
            
            // text
            ctx.fillStyle = "#000";
            ctx.fillText(text, xP + 10, yP + h / 1.5);

            // frame
            if (i === submenu.length - 1) {
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 2;
                ctx.strokeRect(xP, yPos, maxWidth + 20, (h+10) * numberOfItems);
            }
        }
    }

    subMenuHover(x, y, w, h, ctx) {
        ctx.fillStyle = "#d1d1d1"
        ctx.fillRect(x, y, w, h)
    }
}

export const UIpref = {
    titlebar: {
        h: 30,
        color: "#fff",
    },
    window: {
        color: "#fff",
    },
    taskbar: {
        h: 30,
        color: "#fff",
        spacing: 25,
        menu: { hoverColor: "#9c9c9c"}
    },
    button: {
        hoverColor: "#9c9c9c"
    }
}

export const windows = [];