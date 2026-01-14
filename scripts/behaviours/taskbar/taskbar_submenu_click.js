import { Window, Button, Taskbar, Label, UIpref, windows, Textbox } from '../../classes.js'
import { createIcon } from '../desktopBehaviours.js';

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
        createIcon();
    },
    Close() {
        windows.splice(windows.length - 1, 1)
    }
}