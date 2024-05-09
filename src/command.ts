let CommandSet: Map<number, Command> = Object()

class Command {
    constructor(name?: string ,exe?: string, args?: string, cwd?: string) {
        this.id = Date.now(); // Enough to distinguish out each command.
        this.name = name ? name : "";
        this.executable = exe ? exe : "";
        this.arguments = args ? args : "";
        this.cwd = cwd ? cwd : "";
    }

    id: number
    name: string
    executable: string
    arguments: string
    cwd: string
}


export {
    Command,
    CommandSet,
}
