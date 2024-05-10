import { App, ItemView, Notice, Platform, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';

import ObCallerSettingTab from '@/setting';
import { Command } from './command';
import { existsSync } from 'fs';
import { exec } from 'child_process';
import { runCommand } from './runner';

interface ObCallerSettings {
    storedCommands: Command[],
}

const COMMAND_TEMPLATE = new Command(0, "Python Version", "/usr/bin/python", "--version", undefined, false);

const DEFAULT_SETTINGS: ObCallerSettings = {
    storedCommands: [COMMAND_TEMPLATE]
};

export default class ObCaller extends Plugin {
    settings = DEFAULT_SETTINGS;

    async onload() {
        // Initialize things...
        Command.initCommands(this);

        await this.loadSettings();

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new ObCallerSettingTab(this.app, this));

        // Register some commands marked with `obCmd`
        this.settings.storedCommands.forEach((cmd, _idx, _arr) => cmd.register());

    }

    async onunload() {
        await this.saveSettings();
    }

    async loadSettings() {
        // this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        const data: ObCallerSettings = await this.loadData();
        let cmdFromData = data.storedCommands.map((val, _idx, _arr) => Command.loadData(val));

        this.settings.storedCommands = data.storedCommands.length != 0 ? cmdFromData : DEFAULT_SETTINGS.storedCommands;
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
