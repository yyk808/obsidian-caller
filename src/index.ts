import { App, ItemView, Platform, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';

import TestTab from "./ui/TestTab.svelte"
import ObCallerSettingTab from './settings/MainPage';

const VIEW_TYPE = "svelte-view";

// Remember to rename these classes and interfaces!

interface ObCallerSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: ObCallerSettings = {
    mySetting: 'default'
};


export default class ObCaller extends Plugin {
    settings: ObCallerSettings = DEFAULT_SETTINGS;

    async onload() {
        await this.loadSettings();
        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new ObCallerSettingTab(this.app, this));
    }

    async onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
