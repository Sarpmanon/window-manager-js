import { Window, Button, Taskbar, UIpref, windows, Label, Desktop, Textbox, Checkbox } from './scripts/classes.js'
import { inRect } from './scripts/utils.js' 
import { all_cursors } from './assets/cursors/cursors.js'
import { runCommand } from './scripts/terminal/commands.js'
import { all_error_symbols } from './assets/error_symbols/symbols.js'

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

// --------------------- Desktop ---------------------

export const Desktop_Main = new Desktop()
const Disk_Btn = new Button(0, 0, 60, 50, { type: "img", src: "./assets/icons/5in_fdd.png", alt: "System"}, () => {
    const System_Window = new Window(40, 70, 300, 200, "System")
})
Desktop_Main.addElement(Disk_Btn)


function drawDesktop() {
    Desktop_Main.drawAt(ctx)
}

// --------------------- Desktop ---------------------

const win_test2 = new Window(40, 70, 300, 200, "TestWindow")

//Terminal Window
export const LogArray = [];
function createTerminalWindow() {
    const terminalWin = new Window(Math.floor(Math.random() * 100), UIpref.taskbar.h + Math.floor(Math.random() * 110), 300, 200, "Terminal")
    const term_textBox = new Textbox(0 + terminalWin.x + 5, 0 + terminalWin.y + terminalWin.h, terminalWin.w - 10 - 50, 25)

    refreshTerminal(terminalWin, term_textBox);
    
    const term_confirmButton = new Button(0 + terminalWin.x + 5 + (terminalWin.w - 10 - 45), 0 + terminalWin.y + terminalWin.h, 50, 25, { type: "text", src:"", alt: "Enter"}, () => {
        if (!term_textBox.text) return;
        if (term_textBox.text.startsWith("clear ")) { 
            runCommand(`clear ${term_textBox.text.split(" ")[1]}`)
            return;
        }
        
        const term_returnedFunc = runCommand(term_textBox.text)
        LogArray.push(`user§${term_textBox.text}`)
        
        LogArray.push(`system§${term_returnedFunc}`)
        refreshTerminal(terminalWin, term_textBox);

        term_textBox.text = "";
    })

    terminalWin.addElement(term_textBox, true)
    terminalWin.addElement(term_confirmButton, true)

    return terminalWin
}

function refreshTerminal(terminalWin, term_textBox) {
    if (!terminalWin || !term_textBox) throw new Error("Missing parameters in function 'refreshTerminal'")

    //I don't think that running two loops that are almost identical are efficient, but here we are
    for (let i = terminalWin.children.length - 1; i >= 0; i--) {
        const child = terminalWin.children[i]
        if (child instanceof Label) {
            terminalWin.children.splice(i, 1)
        }
    }

    LogArray.forEach((log, index) => {
        let finalOutput;
        const [determinator_key, remaining_Command] = LogArray[index].split("§")
        if (determinator_key == "user") {
            finalOutput = `/> ${remaining_Command}`
        } else if (determinator_key == "system") {
            finalOutput = remaining_Command;
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(terminalWin.x, terminalWin.y, terminalWin.w, terminalWin.h, "#d381236");
        ctx.clip()
        const term_newLabel = new Label(terminalWin.x, terminalWin.y + UIpref.titlebar.h + (index * 15), 0, 0, finalOutput)
        ctx.restore();

        terminalWin.addElement(term_newLabel, true)
    })
}

function drawTerminalBorder() {
    const exists = windows.find(w => w.title == "Terminal")
    if (!exists) return;

    ctx.beginPath();
    ctx.setLineDash([5, 5])
    ctx.lineWidth = "2"
    ctx.strokeRect(exists?.x + 1, exists?.y + UIpref.titlebar.h + 1, exists?.w - 1, exists?.h - 1 - 35)
    ctx.setLineDash([])
    ctx.closePath();

    //ctx.fillRect(exists?.x, exists?.y, 100, 100)
}
//Terminal Window

const Button_Sample = new Button(0, 0, 60, 50, { type: "img", src: "./assets/icons/system_alive.png", alt: "This PC" }, null)
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
    mouse.x = e.clientX
    mouse.y = e.clientY

    mouse.down = true;

    taskbar.click(mouse.x, mouse.y)
    if (taskbar.selectedMenu != -1) return;

    // Windows
    let ifWindowClicked = false;
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

        wind.click(mouse.x, mouse.y, ctx)
        ifWindowClicked = true;

        break;
    }

    if (ifWindowClicked) return;

    // Desktop
    for (let i = 0; i < Desktop_Main.children.length; i++) {
        const child = Desktop_Main.children[i]
        child.click()
    }
})

canvas.addEventListener("mouseup", (e) => {
    mouse.dragging = false;
    mouse.target = null;

    mouse.down = false;

    for (let i = windows.length -1; i >= 0; i--) {
        const wind = windows[i]

        wind.unClick()
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
            } else if (e.key == "CapsLock" || e.key == "Delete" || e.key == "Shift" || e.key == "Insert" || /^F\d{1,2}$/.test(e.key)) {return}

            element.text = element.text + e.key
        });
    }
})
document.addEventListener("keyup", (e) => {
    delete keypresses[e.key]
})

function checkKeys() {
    if (keypresses["Alt"] && keypresses["q"]) {
        windows.splice(windows.length - 1, 1)
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

function wrapTextLines(text, maxWidth) {
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
    return lines;
}

const errorMessage = {
    active: true,
    title: "Significant Error",
    description: "Your computer has run into a problem and has to restart.",
    type: ""
}
function drawError() {
    if (!errorMessage["active"]) return;

    const padding = 30;
    const yPos = UIpref.taskbar.h + padding

    //frame surrounding it
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 3;
    ctx.strokeRect(padding, yPos , canvas.width - (padding * 2), canvas.height / 4)

    //background
    ctx.fillStyle = "#fff"
    ctx.fillRect(padding, yPos, canvas.width - (padding * 2), canvas.height / 4)

    //second frame that wraps inside
    ctx.lineWidth = 2.5;
    ctx.strokeRect(padding + 5, yPos + 5, canvas.width - (padding * 2) - 10, canvas.height / 4 - 10)

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
}

function tick() {
    drawDesktop();
    drawWindows();
    drawTaskbar();
    drawError();

    drawMouse();

    drawTerminalBorder();
    
    requestAnimationFrame(tick)
}

tick();

document.body.appendChild(canvas)