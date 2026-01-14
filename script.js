import { Window, Button, Taskbar, UIpref, windows, elements, Label, Desktop, Textbox, Checkbox, ContextMenu } from './scripts/classes.js'
import { inRect, wrapTextLines } from './scripts/utils.js' 
import { all_cursors } from './assets/cursors/cursors.js'
import { runCommand } from './scripts/terminal/commands.js'
import { all_error_symbols } from './assets/error_symbols/symbols.js'
import { general_icons } from './assets/icons/icons.js'
import { createIcon } from './scripts/behaviours/desktopBehaviours.js'

export const canvas = document.createElement("canvas")
canvas.id = "canvas"

globalThis.ctx = canvas.getContext("2d")
export const ctx = globalThis.ctx

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

document.body.style.cursor = "none" //hides the cursor that the user uses

export let mouse = {
    x: 0,
    y: 0,
    dragging: false,
    down: false,
    target: null,
    offsetX: 0,
    offsetY: 0,
    type: "default",
}

function drawMouse() {
    if (mouse.type === "default") { ctx.drawImage(all_cursors.default, mouse.x, mouse.y) }
    if (mouse.type === "text") { ctx.drawImage(all_cursors.text, mouse.x, mouse.y) }
}

function drawWindows() {
    if (!windows) return;

    for (let window of windows) {
        window.draw(ctx)

        for (let element of window.children) {
            //element.x = window.x;
            //element.y = window.y;
        }

    }
}


// --------------------- Taskbar and submenus ---------------------
const taskbar_items = [
    { label: "Menu", submenu: ["About...", "Control Panel"]},
    { label: "File", submenu: ["New", "Close"]},
    { label: "Edit", submenu: ["AAAAAA", "Test", "aaaa"]}
]
export const taskbar = new Taskbar()
for (let i = 0; i < taskbar_items.length; i++) { 
    ctx.font = "14px Chicago"

    const tskbr_item = taskbar_items[i];
    const btnwidth = ctx.measureText(tskbr_item.label).width
    
    const tskbr_btn = new Button(0, 0, btnwidth, UIpref.taskbar.h, { type: "text", src: tskbr_item.submenu, alt: tskbr_item.label})
    taskbar.addElement(tskbr_btn)
}

function drawTaskbar() {
    taskbar.draw(ctx)
}
// --------------------- Taskbar and submenus ---------------------

// --------------------- Desktop --------------------- {
export const Desktop_Main = new Desktop()
const Disk_Btn = new Button(0, 0, 60, 50, { type: "img", src: "system", alt: "System"}, () => {
    const System_Window = new Window(40, 70, 300, 200, "System")
})
Desktop_Main.addElement(Disk_Btn)


function drawDesktop() {
    Desktop_Main.drawAt(ctx)
}

// --------------------- Desktop --------------------- }

const win_test2 = new Window(40, 70, 300, 200, "TestWindow")

//Terminal Window {
export const LogArray = [];
function createTerminalWindow() {
    const terminal_terminalWin = new Window(Math.floor(Math.random() * 100), UIpref.taskbar.h + Math.floor(Math.random() * 110), 400, 300, "Terminal")
    terminal_terminalWin.visible = true;
    terminal_terminalWin.debug = false;
    const term_textBox = new Textbox(0 + terminal_terminalWin.x + 5, 0 + terminal_terminalWin.y + terminal_terminalWin.h, terminal_terminalWin.w - 10 - 50, 25)

    const term_resulttextbox = new Textbox(terminal_terminalWin.x + 5, terminal_terminalWin.y + 5 + UIpref.titlebar.h, terminal_terminalWin.w - 10, terminal_terminalWin.h - 45)
    term_resulttextbox.clickable = false;

    refreshTerminal(terminal_terminalWin, term_textBox, term_resulttextbox);
    
    const term_confirmButton = new Button(0 + terminal_terminalWin.x + 5 + (terminal_terminalWin.w - 10 - 45), 0 + terminal_terminalWin.y + terminal_terminalWin.h, 50, 25, { type: "text", src:"", alt: "Enter"}, () => {
        if (!term_textBox.text) return;
        //Clears the terminal iirc, too lazy to properly check
        if (term_textBox.text.startsWith("clear ")) { 
            runCommand(`clear ${term_textBox.text.split(" ")[1]}`)
            return;
        }
        
        const term_returnedFunc = runCommand(term_textBox.text)
        LogArray.push(`user§${term_textBox.text}`)
        
        LogArray.push(`system§${term_returnedFunc}`)
        refreshTerminal(terminal_terminalWin, term_textBox, term_resulttextbox);

        term_textBox.text = "";
    })

    terminal_terminalWin.addElement(term_textBox, true)
    terminal_terminalWin.addElement(term_resulttextbox, true)
    terminal_terminalWin.addElement(term_confirmButton, true)
}

function refreshTerminal(terminalWin, term_textBox, resulttextbox) {
    if (!terminalWin || !term_textBox)
        throw new Error("Missing parameters in function 'refreshTerminal'")

    const renderedLines = [];

    LogArray.forEach(log => {
        const [key, msg] = log.split("§");

        if (key === "user") {
            renderedLines.push(`/> ${msg}`);
        } else {
            const wrapped = wrapTextLines(msg, resulttextbox.w);
            renderedLines.push(...wrapped);
        }
    });

    resulttextbox.text = renderedLines.join("\n");
}

export let debugModeActive = false;
export function unnecessaryFunctionToEnableorDisableDebugModeActiveVariable(statement) {
    debugModeActive = statement;
}
function debugModeDraw() {
    if (!debugModeActive) return;

    ctx.textAlign = "left"
    ctx.textBaseline = "middle"

    const textString = `Window W: ${window.innerWidth}
    Window H: ${window.innerHeight}
    FPS: ${fps}
    Elements: ${elements.length}
    Windows: ${windows.length}`
    let textWidth = ctx.measureText(textString).width;
    const textX = UIpref.taskbar.w - (textWidth / 4)
    const textY = UIpref.taskbar.h + 15

    const textSplit = textString.split("\n")
    textSplit.forEach((t, index) => {
        const text = t.trim()
        ctx.fillText(text, textX, textY + (15 * index))
    })
}
//Terminal Window }

const Button_Sample = new Button(0, 0, 60, 50, { type: "img", src: "globe folder", alt: "This PC" }, () => {
    console.log(Button_Sample.spec.alt)
})
const Text_Button_Sample = new Button(0, 0, 60, 20, { type: "text", src: null, alt: "doktor" }, null)
const Sample_Label = new Label(0, 0, 0, 0, "labeltest")
const Text_Checkbox = new Checkbox(120, 130, "Test", false)
win_test2.addElement(Button_Sample)
win_test2.addElement(Text_Button_Sample)
win_test2.addElement(Sample_Label)
win_test2.addElement(Text_Checkbox, true)


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
    // Context Menu Stuff
    if (e.button == 0) {
        //Left click, deletes the ContextMenu class
        isContextMenuOpen = false;
        openContextMenu = null;
    } else if (e.button == 2) {
        //Right click, creates a ContextMenu class
        isContextMenuOpen = true;
        createContextMenu();
        return;
    }

    mouse.x = e.clientX
    mouse.y = e.clientY

    mouse.down = true;

    taskbar.click(mouse.x, mouse.y)
    if (taskbar.selectedMenu != -1) return;

    // Windows
    let clickedInsideWindow = false;
    for (let i = windows.length - 1; i >= 0; i--) {
        const wind = windows[i]

        if (inRect(mouse, wind.x, wind.w, wind.y, wind.h + UIpref.titlebar.h)) {
            clickedInsideWindow = true;

            windows.splice(i, 1)
            windows.push(wind)

            // Checks if titlebar is the part being clicked
            if (inRect(mouse, wind.x, wind.w, wind.y, wind.h)) {
                mouse.dragging = true;
                mouse.target = wind;
                mouse.offsetX = mouse.x - wind.x
                mouse.offsetY = mouse.y - wind.y

                wind.click(mouse.x, mouse.y, ctx)
            }

            // Check the children array of the clicked window
            for (let child of wind.children) {
                if (child.click) child.click(mouse.x, mouse.y)
            }

            break;
        }
    }

    // If none of the windows are clicked, go for the desktop elements,
    if (!clickedInsideWindow) {
        /*Desktop_Main.children.forEach(child => {
            if (child.click) child.click(mouse.x, mouse.y)
        })*/
        elements.forEach(element => {
            element.click(mouse.x, mouse.y)
        })
    }
})

canvas.addEventListener("mouseup", (e) => {
    mouse.dragging = false;
    mouse.target = null;

    mouse.down = false;

    for (let i = windows.length -1; i >= 0; i--) {
        const wind = windows[i]
        if (!wind) return;

        wind.unClick();
    }
})

const keypresses = {};
document.addEventListener("keydown", (e) => {
    keypresses[e.key] = true;
    checkKeys();

    for(let i = windows.length - 1; i >= 0; i--) {
        const wind = windows[i]

        if (windows.indexOf(wind) !== windows.length - 1) return;

        wind.children.forEach((element, ind) => {
            //probably one of the must inefficient ways to do this, but I genuinely don't give a fuck
            if (!(element instanceof Textbox)) return;
            if (element.active == false) return;

            if (e.key == "Backspace") {
                element.text = element.text.slice(0, -1)
                return;
            } else if (e.key == "Space") {
                element.text = element.text += " "
                return;
            } else if (e.key == "Enter") {
                element.text = element.text = element.text + "\n"
                return;
            } else if (e.key == "CapsLock" || e.key == "Delete" || e.key == "Shift" || e.key == "Insert" || e.key == "Control" || e.key == "Alt" || e.key == "Meta" || /^F\d{1,2}$/.test(e.key)) {return}

            element.text = element.text + e.key
        });
    }
})
document.addEventListener("keyup", (e) => {
    delete keypresses[e.key]
})

function checkKeys() {
    if (keypresses["Alt"] && keypresses["q"]) {
        const shittyAssVariableForaShittyAssWindow = windows[windows.length - 1]
        shittyAssVariableForaShittyAssWindow.emit("close")
        shittyAssVariableForaShittyAssWindow.close()
    }
    if (keypresses[`"`]) {
        const existing = windows.find(w => w.title === "Terminal")

        if (existing) {
            windows.splice(windows.indexOf(existing), 1)
        } else {
            createTerminalWindow()
        }
    }
}

export const errorMessage = {
    active: false,
    title: "Significant Error",
    description: "Your computer has run into a problem and has to restart.",
    type: "",
    id: 0,
}
const error_confirmButton = new Button(0, 0, 45, 30, { type: "text", src:"", alt: "Enter"}, () => {
    errorMessage.active = false;
})
function drawError() {
    if (!errorMessage["active"]) return;

    const padding = 30;
    const yPos = UIpref.taskbar.h + padding
    const width = canvas.width - (padding * 2)
    const height = canvas.height / 4

    //frame surrounding it
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 3;
    ctx.strokeRect(padding, yPos , canvas.width - (padding * 2), height)

    //background
    ctx.fillStyle = "#fff"
    ctx.fillRect(padding, yPos, canvas.width - (padding * 2), height)

    //second frame that wraps inside
    ctx.lineWidth = 2.5;
    ctx.strokeRect(padding + 5, yPos + 5, canvas.width - (padding * 2) - 10, height - 10)

    //icon
    ctx.drawImage(all_error_symbols.critical, padding + 15, yPos + 10)

    //title
    ctx.font = "18px Chicago";
    ctx.fillStyle = "#000"
    ctx.textAlign = "left"
    ctx.textBaseline = "top"
    ctx.fillText(errorMessage.title, padding + 15 + 62, yPos + 15)

    //description
    ctx.font = "14px Chicago";
    ctx.fillStyle = "#000"
    ctx.textAlign = "left"
    ctx.textBaseline = "top"

    const lines = wrapTextLines(errorMessage.description, (canvas.width - (padding * 2)) - 5 - (padding + 15 + 62))

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        ctx.fillText(line, padding + 15 + 62, yPos + 35 + (15 * i))
    }

    //ID
    ctx.font = "14px Chicago"
    ctx.fillText(`ID=${errorMessage.id}`, padding * 1.5, (yPos + height) - 30)

    error_confirmButton.drawAt(ctx, width - padding, (height + yPos / 2) - 10, null)

}

function drawDebugInfo() {
    const found = windows.find(w => w.title == "Terminal")
    if (!found?.debug) return;

    ctx.fillStyle = "#000"
    ctx.fillText(`X: ${mouse.x} Y: ${mouse.y}`, 50, 50)
}

//These 2 work together so it doesn't run a for loop every fucking frame
let last = 0;
const target_fps = 10;
const interval = 1000 / target_fps

var active_el = null;
let active_el_index = null;

export function fuckAss() { //probably unnecesary, removes selection from all elements
    active_el = null
}

function checkSelected(timestamp) {
    if (timestamp - last >= interval) {
        last = timestamp;

        for (let i = 0; i < elements.length; i++) {
            const el = elements[i]
            if (!el.selected) {
                continue;
            }

            active_el = el;
            active_el_index = i;
        }
    }
}

function drawSelected() {
    if (!active_el) return;

    ctx.strokeStyle = "#ff0000"
    ctx.strokeRect(active_el.x, active_el.y, active_el.w, active_el.h)

    ctx.fillStyle = "#ff0000"
    ctx.textAlign = "left"
    ctx.textBaseline = "bottom"

    const el_infotext = `[${active_el_index}] ${active_el.constructor.name} X: ${active_el?.XPos} Y: ${active_el?.yPos} W: ${active_el.w} H: ${active_el.h}`
    ctx.fillText(el_infotext, 15, canvas.height - 15)
}
//These 2 work together so it doesn't run a for loop every fucking frame

let isContextMenuOpen = false;
let openContextMenu = null;

function drawContextMenu() {
    if (!isContextMenuOpen) return;
    openContextMenu.drawAt();
}
function createContextMenu() {
    const DesktopContextMenu = new ContextMenu(mouse.x, mouse.y)
    const DesktopContextMenu_NewButton = new Button(0,0,100,50, { type: "text", src: "", alt: "New File"}, () => {
        createIcon()
        DesktopContextMenuRemoveChildren(DesktopContextMenu)
    })
    const DesktopContextMenu_RefreshButton = new Button(0,0,100,50, { type: "text", src: "", alt: "Refresh"}, () => {
        Desktop_Main.refresh()
        DesktopContextMenuRemoveChildren(DesktopContextMenu)
    })

    DesktopContextMenu.addElement(DesktopContextMenu_NewButton, DesktopContextMenu_RefreshButton)

    openContextMenu = DesktopContextMenu;
}
function DesktopContextMenuRemoveChildren(dcm) {
    dcm.children.forEach(child => {
        child.remove();
    })
}

//FPS Counter
let lastTime = performance.now();
let frames = 0;
let fps = 0;

function tick(timestamp) {
    frames++;
    if (timestamp - lastTime >= 1000) {
        fps = frames;
        frames = 0;
        lastTime = timestamp;
    }

    //resets the mouse to prevent it from bugging out when there are more than 1 children that changes the mouse in a single window
    mouse.type = "default"

    drawDesktop();
    drawWindows();
    drawTaskbar();
    drawContextMenu();
    drawError();

    drawDebugInfo();
    checkSelected(timestamp);
    drawSelected();

    debugModeDraw();

    for (let i = 0; i < 5; i++) { drawMouse(); }

    requestAnimationFrame(tick)
}

tick();

document.body.appendChild(canvas)