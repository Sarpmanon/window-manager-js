import { inRect, sleep } from "./utils.js";
import { canvas, mouse } from "../script.js";
import { handleCommand } from "./behaviours/taskbar/commandHandler.js"

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

        drawAt(ctx, x, y) {
        }

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

        this.xPos = 0;
        this.yPos = 0;
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

    drawAt(ctx, xPos, yPos, windowRef) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.updateHover(xPos, yPos);

        if (this.spec.type === "img") {
            const icon = new Image();
            icon.src = this.spec.src;
            
            const topWindow = windows.length > 0 ? windows[windows.length - 1] : null

            const textWidth = ctx.measureText(this.spec.alt).width

            if (this.hover && ((this.type=="desktop" && (!topWindow || mouse.x<topWindow.x||mouse.x>topWindow.x+topWindow.w||mouse.y<topWindow.y||mouse.y>topWindow.y+topWindow.h)) || topWindow===windowRef)) {
                ctx.fillStyle = UIpref.button.hoverColor
                ctx.fillRect(xPos, yPos, this.w, this.h);
            }
            //ctx.fillStyle = this.hover && (windows?.indexOf?.(window)) == 1 ? UIpref.button.hoverColor : "#fff";

            ctx.fillStyle = "#000";
            ctx.font = "14px Chicago";
            ctx.textAlign = "left"
            ctx.fillText(this.spec.alt, xPos + ((this.w / 2) - textWidth / 2), yPos + this.h + 10);

            ctx.drawImage(icon, xPos + (this.w - icon.width) / 2, yPos + (this.h - icon.height) / 2);
        } else if (this.spec.type === "text") {
            if (this.hover) {
                ctx.fillStyle = UIpref.taskbar.menu.hoverColor
                ctx.fillRect(xPos, yPos, this.w, this.h);
            }

            ctx.fillStyle = "#000";
            ctx.font = "14px Chicago";
            ctx.textAlign = "left"
            ctx.fillText(this.spec.alt, xPos, yPos + this.h / 2);
        }
    }

    click() {
        if (
            mouse.x > this.xPos &&
            mouse.x < this.xPos + this.w &&
            mouse.y > this.yPos &&
            mouse.y < this.yPos + this.h
        ) {
            this.onClick?.()
        }
    }

    unClick() {

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

    addElement(element, posOverride) {
        if (!element) return;
        element.posOverride = !!posOverride
        if (posOverride) {
            element.relX = element.x - this.x;
            element.relY = element.y - this.y;
        }

        this.children.push(element)
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        this.ctx = ctx;

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

        ctx.fillStyle = UIpref.titlebar.color;
        ctx.fillRect(this.x, this.y, this.w, UIpref.titlebar.h);

        // title
        ctx.font = "14px Chicago";
        ctx.fillStyle = "#000";
        ctx.textBaseline = "middle";
        let titleWidth = ctx.measureText(this.title).width;
        ctx.textAlign = "left"
        ctx.fillText(this.title, (this.x + this.w / 2) - titleWidth / 2, this.y + UIpref.titlebar.h / 2);

        //tile spacing thingy
        const spacing = 10;
        const leftPadding = 10;
        const topPadding = UIpref.titlebar.h;
        const usableWindow = this.w - leftPadding;

        const fullBoxWidth = 60 + spacing;
        const cols = Math.floor(usableWindow / fullBoxWidth);

        let totalPrevHeight = 0;
        let row = 0, col = 0;

        for (let i = 0; i < this.children.length; i++) {
            const el = this.children[i];
            if (el.posOverride) {
                const xPos = this.x + el.relX;
                const yPos = this.y + el.relY;

                el.drawAt(ctx, xPos, yPos, this); continue
            }

            col = i % cols;
            row = Math.floor(i / cols);

            if (col === 0) {
                const sameRow = this.children.slice(i - cols, i);
                const maxH = Math.max(...sameRow.map(e => e.h + 20 || 0), 0);
                totalPrevHeight += maxH + spacing;
            }

            const xPos = this.x + leftPadding + col * fullBoxWidth;
            const yPos = this.y + topPadding + totalPrevHeight;

            el.drawAt(ctx, xPos, yPos, this);
            el.type = "window"
        }

        // Close button
        if (!this.clicked) {
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x + 10, this.y + 10, 10, 10);
        } else {
            ctx.fillStyle = "#000";
            ctx.fillRect(this.x + 10, this.y + 10, 10, 10);
        }
    }


    click(mx, my, ctx) {
        // --------------------- Clicks each child ---------------------
        this.children.forEach(el => { el.click(mx, my) })
        const g = this.getClose()

        // --------------------- Close Button ---------------------
        if (inRect({ x: mx, y: my}, g.x, g.w, g.y, g.h)) {
            this.clicked = true;

            setTimeout(() => {
                this.close();
            }, 50);
        }
    }

    unClick() {
        // --------------------- Unclicks each child ---------------------
        this.children.forEach(el => { el.unClick() })

        // --------------------- Unhovers the window ---------------------
        this.clicked = false;
    }

    getClose() {
        return { x: this.x + 10, y: this.y + 10, w: 10, h: 10};
    }

    close() {
        const iof = windows.indexOf(this);
        if (iof >= 0) windows.splice(iof, 1)
    }
}

export class Taskbar extends UIElement {
    constructor(x,y,w,h) {
        super(x, y, w, h)

        this.items = [];
        this.selectedMenu = -1;
    }

    addElement(element) {
        if (!element) return
        this.items.push(element)
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        this.w = window.innerWidth;
        this.h = UIpref.taskbar.h;
        this.x = 0;
        this.y = 0;

        ctx.font = "14px Chicago" //font

        // --------------------- Main Background ---------------------
        ctx.fillStyle = UIpref.taskbar.color;
        ctx.fillRect(this.x, this.y, this.w, this.h)

        let xPos = 10;
        let yPos = (UIpref.taskbar.h / 2)

        //finds the widest string
        let thisItems = this.items;
        let widestString = Math.max(...thisItems.map(it => ctx.measureText(it.spec.alt).width))

        for (let i = 0; i < this.items.length; i++) {
            const taskMenu = this.items[i]

            const textWidth = taskMenu.w
            const boxWidth = widestString + 20; //padding

            // Hover
            if (inRect({ x: mouse.x, y: mouse.y }, xPos - 10, boxWidth, yPos - UIpref.titlebar.h / 2, UIpref.taskbar.h)) {
                ctx.fillStyle = UIpref.taskbar.menu.hoverColor;
                ctx.fillRect((xPos - 10), yPos - UIpref.taskbar.h / 2, boxWidth, UIpref.taskbar.h)
            
                if (mouse.down) {
                    if (this.selectedMenu == i) {
                        this.selectedMenu = -1;
                    } else {
                        this.selectedMenu = i;
                    }
                    mouse.down = false;
                }
            }
            
            // Draws the submenu based on index
            if (this.selectedMenu != -1 && this.selectedMenu == i) {
                this.drawSubMenu(xPos - 10, UIpref.titlebar.h, textWidth + 20, UIpref.taskbar.h, i, ctx);
            };

            // Draws the text
            ctx.fillStyle = "#000"
            ctx.font = "14px Chicago"
            ctx.textBaseline = "middle"
            ctx.textAlign = "center"
            ctx.fillText(taskMenu.spec.alt, xPos+ (boxWidth / 2) - (textWidth / 2), yPos)

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.moveTo(0, UIpref.taskbar.h)
            ctx.lineTo(canvas.width, UIpref.taskbar.h)
            ctx.stroke()

            xPos += widestString + UIpref.taskbar.spacing
        }
    }

    drawSubMenu(xPos, yPos, w, h, index, ctx) {
        let xP = xPos;
        let yP = yPos;

        // finds the longest width of a text
        const submenu = this.items[index].spec.src;
        const maxWidth = Math.max(...submenu.map(text => ctx.measureText(text).width));

        const numberOfItems = this.items[index].spec.src.length;

        for (let i = 0; i < submenu.length; i++) {
            const text = submenu[i];
            yP = yPos + ((h + 10) * i);

            // bg

            if(inRect({ x: mouse.x, y: mouse.y }, xP, maxWidth + 20, yP, h + 10)) {
                this.subMenuHover(xP, yP, maxWidth + 20, h + 10, ctx)
                if (mouse.down) {
                    // zibidizapzup
                    mouse.target = "button"
                    mouse.down = false;

                    // click function
                    handleCommand(this.items[index].spec.src[i])
                    this.selectedMenu = -1;
                }
            } else {
                ctx.fillStyle = "#f0f0f0";
                ctx.fillRect(xP, yP, maxWidth + 20, h + 10);
                mouse.target = null
            }
            
            // text
            ctx.fillStyle = "#000";
            ctx.textAlign = "left"
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

    click(mx, my) {
        if (
            mx > this.x &&
            mx < this.x + this.w &&
            my > this.y &&
            my < this.y + this.h
        ) {
            // TASKBAR CLICK, IMPORTANT FOR LATER
        }
    }
}

export class Label extends UIElement {
    constructor(x, y, w, h, text) {
        super(x, y, w, h);
        this.text = text;
    }

    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        if (!text) return;
        const words = text.split(" ");
        let line = "";

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + " ";
            const testWidth = ctx.measureText(testLine).width;

            if (testWidth > maxWidth && i > 0) {
                ctx.textAlign = "left"
                ctx.fillText(line, x, y);
                line = words[i] + " ";
                y += lineHeight;
            } else {
                line = testLine;
            }
        }

        ctx.textAlign = "left"
        ctx.fillText(line, x, y);
    }

    drawAt(ctx, x, y, parent) {
        ctx.fillStyle = "#000";
        ctx.font = "14px Chicago";
        ctx.textAlign = "left";

        const padding = 10;
        const maxWidth = parent.w - padding * 2;
        const lineHeight = 18;

        this.wrapText(ctx, this.text, x + padding, y + padding, maxWidth, lineHeight);
    }

    click() {}

    unClick() {}
}

export class Desktop {
    constructor() {
        this.children = [];
    }

    addElement(el) {
        if (!el) return
        this.children.push(el)
    }

    drawAt(ctx) {
        ctx.fillRect(0, UIpref.titlebar.h + 1, window.innerWidth, window.innerHeight)

        let currentX = 20;
        let currentY = UIpref.taskbar.h + 10

        const padding = 20;
        const maxH = canvas.height;

        for (let i = 0; i < this.children.length; i++) {
            const el = this.children[i]

            if (currentY + (el.h || 0) > maxH) {
                currentY = UIpref.taskbar.h + 10
                currentX += 100;
            }

            el.drawAt(ctx, currentX, currentY, null)
            el.type = "desktop"

            currentY += (el.h || 0) + padding
        }

        //this.children.forEach((children) => children.drawAt(ctx, 40, 40, null))
    }
}

export class Textbox extends UIElement {
    constructor(x, y, w, h) {
        super(x, y, w, h)
        this.text = ""
        this.active = false;

        this.ctx = null;
    }

    updateHover(xPos, yPos) {
        if (
            mouse.x > this.xPos &&
            mouse.x < this.xPos + this.w &&
            mouse.y > this.yPos &&
            mouse.y < this.yPos + this.h
        ) {
            this.hover = true;
        } else {
            this.hover = false
        }
    }

    drawAt(ctx, xPos, yPos, parent) {
        this.ctx = ctx;
        this.xPos = xPos;
        this.yPos = yPos;

        this.updateHover(xPos, yPos)

        // Draws the rounded frame
        ctx.strokeRoundedRect(xPos, yPos, this.w, this.h, 5, "#000")
        
        //checks if clicked, duh
        if (this.clicked) {
            this.ctx.fillStyle = "#000"
            this.ctx.fillRect(0, 0, 100, 100)
        } else {
        }

        //same here but with hover
        if (this.hover && windows.indexOf(parent) == windows.length - 1) {
            mouse.type = "text"
        } else {
            mouse.type = "default"
        }

        const lines = this.text.split("\n")

        ctx.fillStyle = "#000"
        for (let i = 0; i < lines.length; i++) {
            if (!this.text[i]) return;

            ctx.save()
            ctx.beginPath()
            ctx.rect(xPos, yPos, this.w, this.h)
            ctx.clip()
            
            ctx.fillText(lines[i], xPos + 5, (yPos + (i * 15)) + 10)
            ctx.restore()
        }
    }

    click(mx, my) {
        if (
            mouse.x > this.xPos &&
            mouse.x < this.xPos + this.w &&
            mouse.y > this.yPos &&
            mouse.y < this.yPos + this.h
        ) {
            this.clicked = true;
            this.active = true;
        } else {
            this.active = false
        }
    }

    unClick() {
        this.clicked = false
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
    },
    desktop: {
        buttonHoverColor: "#000"
    }
}

export const windows = [];