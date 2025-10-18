import { Window, Button, Taskbar, UIpref, windows } from './scripts/classes.js'
import { inRect } from './scripts/utils.js' 

export const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.position = "fixed";
canvas.style.left = "0";
canvas.style.top = "0";
canvas.style.width = "100vw";
canvas.style.height = "100vh";
canvas.style.zIndex = "9999";
canvas.style.display = "block";
canvas.style.background = "#fff";

export let mouse = {
    x: 0,
    y: 0,
    dragging: false,
    down: false,
    target: null,
    offsetX: 0,
    offsetY: 0,
}

function drawWindows() {
    if (!windows) return;

    for (let window of windows) {
        window.draw(ctx)

        for (let element of window.children) {
            element.x = window.x;
            element.y = window.y;
        }

    }
}


// --------------------- Taskbar and submenus ---------------------
const taskbar_items = [
    { label: "Menu", submenu: ["About...", "Control Panel"]},
    { label: "File", submenu: ["New", "Close"]},
    { label: "Edit", submenu: ["AAAAAA", "Test", "aaaa"]}
]

const taskbar = new Taskbar()
for (let i = 0; i < taskbar_items.length; i++) { taskbar.addElement(taskbar_items[i]) }

function drawTaskbar() {
    taskbar.draw(ctx)
}
// --------------------- Taskbar and submenus ---------------------

const terminal = new Window(30, 50, 300, 200, "doktor")

const win_test2 = new Window(40, 70, 300, 200, "doktooor")

const button_test = new Button(0, 0, 60, 50, { type: "img", src: "./assets/icons/system_alive.png", alt: "This PC" }, null)
const button_test2 = new Button(0, 0, 60, 20, { type: "text", src: null, alt: "doktor" }, null)
win_test2.addElement(button_test)
win_test2.addElement(button_test)
win_test2.addElement(button_test)
win_test2.addElement(button_test)
win_test2.addElement(button_test)
win_test2.addElement(button_test)
win_test2.addElement(button_test)
win_test2.addElement(button_test2)


canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

    if (mouse.dragging && mouse.target) {
        mouse.target.x = mouse.x - mouse.offsetX
        mouse.target.y = mouse.y - mouse.offsetY
    }
})

canvas.addEventListener("mousedown", (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY

    mouse.down = true;

    if (taskbar.selectedMenu != -1) return;

    for (let i = windows.length - 1; i >= 0; i-- ) {
        const wind = windows[i]
        if (!inRect(mouse, wind.x, wind.w, wind.y, wind.h + UIpref.titlebar.h)) continue;

        if (inRect(mouse, wind.x, wind.w, wind.y, UIpref.titlebar.h)) {
            mouse.dragging = true;
            mouse.target = wind;

            mouse.offsetX = mouse.x - wind.x
            mouse.offsetY = mouse.y - wind.y

            wind.click(mouse.x, mouse.y, ctx)
        }

        windows.splice(i, 1)
        windows.push(wind)

        break;
    }
})

canvas.addEventListener("mouseup", (e) => {
    mouse.dragging = false;
    mouse.target = null;

    mouse.down = false;
})

function tick() {
    ctx.fillStyle = "#e0e0e0"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    drawWindows();
    drawTaskbar();
    requestAnimationFrame(tick)
}

tick();

document.body.appendChild(canvas)