import { App, PluginSettingTab, Setting } from 'obsidian';

import { CommandBuilder } from '@/ui/modals/CommandBuilderModal';
import type ObCaller from '@/main';
import { CommandSet, type Command } from './command';

export default class ObCallerSettingTab extends PluginSettingTab {
    plugin!: ObCaller;

    constructor(app: App, plugin: ObCaller) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { plugin, containerEl, app } = this;

        const buildListTile = (cmd: Command) => {
            let desc = `${cmd.executable} ${cmd.arguments}`;
            desc = desc.length > 32 ? desc.substring(0, 29) + '...' : desc;

            new Setting(containerEl)
                .setName(cmd.name)
                .setDesc(desc)
                .addButton((btn) => btn
                    .setIcon('pencil')
                    .setTooltip('Edit this command')
                    .onClick((_) => {
                        new CommandBuilder(app, cmd, (res) => CommandSet.set(res.id, res)).open();
                    })
                )
                .addButton((btn) => btn
                    .setIcon('trash-2')
                    .setTooltip('Delete this command')
                    .onClick((_) => {
                        CommandSet.delete(cmd.id)
                    })
            )

        }

        containerEl.createEl('h1', '1. Load Commands');

        new Setting(containerEl)
            .setName("Show Modal")
            .addButton((button) => {
                button.setButtonText("Show!");
                button.setTooltip("Show!").onClick((_) => {
                    new CommandBuilder(app).open();
                })
            })


        containerEl.createEl('h1', '2. Commands List');
        containerEl.createEl('ul', 'Test UL');

    }
}
