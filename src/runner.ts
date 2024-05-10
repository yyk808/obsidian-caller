import { exec } from "child_process";
import { App, Notice } from "obsidian";
import { Command } from "@/command";

interface ArgMap {
    [key: string]: string,
}

/* https://stackoverflow.com/questions/16648679/regexp-in-typescript */
function parseStringTemplate(str: string, obj: ArgMap) {
    let parts = str.split(/\$\{(?!\d)[\wæøåÆØÅ]*\}/);
    let args = str.match(/[^{\}]+(?=})/g) || [];
    let parameters = args.map(argument => obj[argument] || (obj[argument] === undefined ? "" : obj[argument]));
    return String.raw({ raw: parts }, ...parameters);
}

function getEnvVars(app: App) {
    const APPID = app.appId;

    return {
        "APPID": APPID,
    };
}

export async function runCommand(cmd: Command, app: App) {
    let cwd = cmd.cwd != "" ? cmd.cwd : undefined;
    let args: string;
    if (cmd.arguments != "") {
        args = parseStringTemplate(cmd.arguments, getEnvVars(app));
    } else {
        args = cmd.arguments;
    }

    const final = `${cmd.executable} ${args}`;
    exec(final, { cwd: cwd }, (error, stdout, stderr) => {
        if (error) {
            const err_msg = `Error executing: ${cmd.executable}`;
            new Notice(err_msg);
            console.log(err_msg);

            return;
        }

        console.log("Command: \n");
        console.log(final);
        console.log("Command Stdout: \n");
        console.log(stdout);
        console.log("\nCommand Stderr: \n");
        console.log(stderr);
    })
}
