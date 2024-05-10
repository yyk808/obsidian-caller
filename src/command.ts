import type { Plugin } from "obsidian";
import { runCommand } from "./runner";

class Command {
    constructor(id?: number, name?: string, exe?: string, args?: string, cwd?: string, obCmd?: boolean) {
        this.id = id ? id : Date.now(); // Enough to distinguish out each command.
        this.name = name ? name : "";
        this.executable = exe ? exe : "";
        this.arguments = args ? args : "";
        this.cwd = cwd ? cwd : "";

        this.obCmd = obCmd ? true : false;

        this._registered = false;
    }

    id: number
    name: string
    executable: string
    arguments: string
    cwd: string

    obCmd: boolean

    _registered: boolean

    /* Private Vars */
    private static plugin: Plugin;

    static initCommands(plugin: Plugin) {
        this.plugin = plugin;
    }

    // to fix a stupid ts compiler bug.
    static loadData(cmd: Command) {
        return new Command(cmd.id, cmd.name, cmd.executable, cmd.arguments, cmd.cwd, cmd.obCmd);
    }

    register(): void {
        if (this._registered) {
            return;
        }

        Command.plugin.addCommand({
            id: "Obsidian-Caller-" + this.id,
            name: this.name,
            checkCallback: (_) => this.obCmd,
            callback: () => {
                runCommand(this, Command.plugin.app);
            }
        });

        this._registered = true;
    }

    unregister(): void {
        if (!this._registered) {
            return;
        }
        // There seems to be no way to directly remove the command.
        // However, after reloading the plugin, everything will be fine.
        this.obCmd = false;
        this._registered = false;
    }
}

export {
    Command
};
