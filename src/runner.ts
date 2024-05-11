import { exec } from "child_process";
import { App, Notice } from "obsidian";
import { Command } from "@/command";

const UNDEFINED = "undefined";
const TRUE = "true";
const FALSE = "false";

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
    const vault = app.vault;
    const editor = app.workspace.activeEditor;
    const cursor = editor?.editor?.getCursor();

    const cur_file = editor?.file?.path;
    const cur_line_number = cursor?.line;
    const cur_line = cur_line_number ? editor?.editor?.getLine(cur_line_number) : undefined;
    const selected = editor?.editor?.getSelection();

    return {
        "APPID": app.appId,
        "TITLE": app.getAppTitle(),
        "VAULT_ROOT": vault.getRoot().path,
        "VAULT_NAME": vault.getName(),
        "CONFIG_PATH": vault.configDir,

        "CUR_FILE": cur_file ? cur_file : UNDEFINED,
        "CUR_LINE_NUM": cur_line_number ? cur_line_number.toString() : UNDEFINED,
        "CUR_LINE": cur_line ? cur_line : UNDEFINED,
        "SELECTED": selected ? selected : UNDEFINED,
        "IS_MOBILE": app.isMobile ? TRUE : FALSE,

    };
}

export async function runCommand(cmd: Command, app: App, options?: undefined) {
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
