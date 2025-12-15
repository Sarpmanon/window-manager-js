import { LogArray, fuckAss } from "../../script.js"
import { elements } from "../classes.js"

const commands = {
    about: {
        name: "about",
        func: () => {
            return `System 1`
        }
    },
    clear: {
        name: "clear",
        func: () => {
            //if (!array || array == "") return "No array was found."

            try {
                LogArray.splice(0, LogArray.length)
                return "Success!"
            } catch (error) {
                return `There was an error: ${error}`
            }
        }
    },
    element_list:  {
        name: "element_list",
        func: () => {
            const all_constructors = [];
            elements.forEach((el, i) => {
                all_constructors.push(`[${i}]`)
                all_constructors.push(`${el.constructor.name}`)
            })
            return all_constructors.toString().replaceAll(",", " ");
        }
    },
    element_select: {
        name: "element_select",
        func: (el_ind) => {
            if (el_ind == -1 || el_ind.toString() == "-1") {
                elements.forEach(el => {
                    el.selected = false
                });

                fuckAss();
                return "Removed selection from all elements."
            }

            const element = elements[el_ind.toString()]
            if (!element) return "No element selected!";

            elements.forEach(element => element.selected = false)
            element.selected = true;

            return "Done!";
        }
    }
}

export function runCommand(input) {
    const [cmd, ...args] = input.split(" ")
    if (commands[cmd]) {
        return commands[cmd].func(args)
    } else {
        return "Unknown command!"
    }
}