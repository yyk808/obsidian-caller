import { App, ItemView, Platform, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';

import ObCallerSettingTab from '@/setting';
import { CommandSet, type Command } from './command';

interface ObCallerSettings {
    storedCommands: Command[],
}

const DEFAULT_SETTINGS: ObCallerSettings = {
    storedCommands: []
};


export default class ObCaller extends Plugin {
    settings: ObCallerSettings = DEFAULT_SETTINGS;

    async onload() {
        await this.loadSettings();

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new ObCallerSettingTab(this.app, this));
    }

    async onunload() {
        await this.saveSettings();
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

        this.settings.storedCommands.forEach((cmd, _idx, _arr) => CommandSet.set(cmd.id, cmd));
    }

    async saveSettings() {
        this.settings.storedCommands = [];
        for(const item of CommandSet) {
            this.settings.storedCommands.push(item[1]); // a stupid way
        }

        await this.saveData(this.settings);
    }
}
