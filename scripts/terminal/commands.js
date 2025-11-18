const commands = {
    about: {
        name: "about",
        func: () => {
            return `System 1`
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