import { Window, Button, Taskbar, Label, UIpref, windows, Textbox } from '../../classes.js'
import { Desktop_Main } from '../../../script.js';

export const Menu_Options = {
    About() {
        const win = new Window(40, 70, 300, 200, "About");
        const label = new Label(0, 0, 0, 0, "Made by Sarpmanon for prototyping purposes.")
        win.addElement(label)
    },
    Control_Panel() {

    }
};

export const File_Options = {
    New() {
        const newfile_button = new Button(0, 0, 60, 50, { type: "img", src: "file", alt: "New File"}, () => {
            const newfile_textwin = new Window(40, 70, 300, 200, newfile_button.spec.alt)

            newfile_button.filetext = "";

            const newfile_textbox = new Textbox(0, 0, 100, 25)

            //TODO: Make the textbox's text save after listening to the window's "close" event
            newfile_textwin.addElement(newfile_textbox)
        })
        Desktop_Main.addElement(newfile_button)
    },
    Close() {
        windows.splice(windows.length - 1, 1)
    }
}