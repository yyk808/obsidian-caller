import { App, ItemView, Notice, Platform, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';

import ObCallerSettingTab from '@/setting';
import { Command } from './command';
import { existsSync } from 'fs';
import { exec } from 'child_process';

interface ObCallerSettings {
    storedCommands: Command[],
}

const COMMAND_TEMPLATE = new Command("Python Version", "/usr/bin/python", "--version", undefined, false);

const DEFAULT_SETTINGS: ObCallerSettings = {
    storedCommands: [COMMAND_TEMPLATE]
};


export default class ObCaller extends Plugin {
    settings = DEFAULT_SETTINGS;

    async onload() {
        await this.loadSettings();

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new ObCallerSettingTab(this.app, this));
    }

    async onunload() {
        await this.saveSettings();
    }

    async loadSettings() {
        // this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        const data: ObCallerSettings = await this.loadData();
        this.settings.storedCommands = data.storedCommands.length != 0 ? data.storedCommands : DEFAULT_SETTINGS.storedCommands;
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

export function checkCommand(cmd: Command): boolean {
    let exist = existsSync(cmd.executable);

    return false;
}

export async function runCommand(cmd: Command) {
    // if (!checkCommand(cmd)) {
    //     console.log("Failed to run command: ", cmd.executable)
    //     return;
    // }
    let cwd = cmd.cwd != "" ? cmd.cwd : undefined;
    // let args = ... replace with variables

    exec(`${cmd.executable} ${cmd.arguments}`, { cwd: cwd }, (error, stdout, stderr) => {
        if (error) {
            const err_msg = `Error executing: ${cmd.executable}`;
            new Notice(err_msg);
            console.log(err_msg);

            return;
        }

        console.log("Command Stdout: \n");
        console.log(stdout);
        console.log("\nCommand Stderr: \n");
        console.log(stderr);
    })
}
