import {App, PluginSettingTab, Setting} from 'obsidian';
import { CommandBuilder } from './CommandBuilder';
import type ObCaller from 'src';

export default class ObCallerSettingTab extends PluginSettingTab {
	plugin!: ObCaller;

	constructor(app: App, plugin: ObCaller) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
    const { plugin, containerEl, app } = this;
    containerEl.empty();

    containerEl.createEl('h1', '1. Load Commands');

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings!.mySetting)
				.onChange(async (value) => {
					this.plugin.settings!.mySetting = value;
					await this.plugin.saveSettings();
				}));

    new Setting(containerEl)
        .setName("Show Modal")
        .addButton((button) => {
          button.setButtonText("Show!");
          button.setTooltip("Show!").onClick((_) => {
            new CommandBuilder(app).open();
          })
        })



	}
}
