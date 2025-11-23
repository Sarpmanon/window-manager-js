import { LogArray } from "../../script.js"

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
    }
}

export function runCommand(input) {
    const [cmd, ...args] = input.split(" ")
    if (commands[cmd]) {
        return commands[cmd].func(args)
    } else if (input.length > 0) {
        return "Unknown command!"
    }
}