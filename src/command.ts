class Command {
    constructor(name?: string, exe?: string, args?: string, cwd?: string, obCmd?: boolean) {
        this.id = Date.now(); // Enough to distinguish out each command.
        this.name = name ? name : "";
        this.executable = exe ? exe : "";
        this.arguments = args ? args : "";
        this.cwd = cwd ? cwd : "";

        this.obCmd = obCmd ? true : false;
    }

    id: number
    name: string
    executable: string
    arguments: string
    cwd: string

    obCmd: boolean
}


export {
    Command
};

