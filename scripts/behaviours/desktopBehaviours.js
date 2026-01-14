import { Desktop_Main } from "../../script.js";
import { Window, Button, Taskbar, Label, UIpref, windows, Textbox } from '../classes.js'

export function createIcon() {
    const newfile_button = new Button(0, 0, 60, 50, { type: "img", src: "file", alt: "New File"}, () => {
        const newfile_window = new Window(Math.floor(Math.random() * 15), Math.floor(Math.random() * 30) + UIpref.taskbar.h, 300, 200, "New File");
        const newfile_textbox = new Textbox(0, 0, newfile_window.w - UIpref.window.padding * 2, newfile_window.h - UIpref.window.spacing * 2)
        newfile_textbox.text = newfile_button.inText;
        newfile_window.addElement(newfile_textbox)

        newfile_window.on("close", () => {
            newfile_button.inText = newfile_textbox.text;
            if(newfile_textbox.text.length > 0) newfile_button.spec.src = "document"
        })
    })

    newfile_button.inText = "";

    Desktop_Main.addElement(newfile_button)
}