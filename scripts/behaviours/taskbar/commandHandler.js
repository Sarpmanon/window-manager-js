import { Menu_Options, File_Options } from './taskbar_submenu_click.js'

export function handleCommand(cmd) {
    switch (cmd) {
        case "About...":
            Menu_Options.About();
            break;
        case "New":
            File_Options.New();
            break;
        default:
            console.log("Unknown command (taskbar)", cmd)
    }
}