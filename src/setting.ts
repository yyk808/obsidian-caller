import { App, PluginSettingTab, Setting } from 'obsidian';

import { CommandBuilder } from '@/ui/modals/CommandBuilderModal';
import type ObCaller from '@/main';
import type { Command } from '@/command';
import { runCommand } from '@/main';

export default class ObCallerSettingTab extends PluginSettingTab {
    plugin!: ObCaller;

    constructor(app: App, plugin: ObCaller) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { plugin, containerEl, app } = this;
        const storedCommands = plugin.settings.storedCommands;

        const buildListTile = (cmd: Command) => {
            let desc = `${cmd.executable} ${cmd.arguments}`;
            desc = desc.length > 32 ? desc.substring(0, 29) + '...' : desc;

            new Setting(containerEl)
                .setName(cmd.name)
                .setDesc(desc)
                .addButton((btn) => btn
                    .setIcon('play')
                    .setTooltip('Test run the command')
                    .onClick((_) => {
                        runCommand(cmd);
                    })
                )
                .addButton((btn) => btn
                    .setIcon('pencil')
                    .setTooltip('Edit this command')
                    .onClick((_) => {
                        new CommandBuilder(app, cmd, (res) => {
                            storedCommands.remove(cmd);
                            storedCommands.push(res);
                            this.display();
                        }).open();
                    })
                )
                .addButton((btn) => btn
                    .setIcon('trash-2')
                    .setTooltip('Delete this command')
                    .onClick((_) => {
                        storedCommands.remove(cmd);
                        this.display();
                    })
            )

        }

        containerEl.empty();

        containerEl.createEl('h1', {text: '1. Load Commands'});

        new Setting(containerEl)
            .setName("Add New Command")
            .addButton((button) => {
                button.setButtonText("Add");
                button.setTooltip("Add").onClick((_) => {
                    new CommandBuilder(app, undefined, (res) => {
                        storedCommands.push(res);
                        this.display();
                    }).open();
                })
            })


        containerEl.createEl('h1', {text: '2. Commands List'});
        for(const cmd of storedCommands) {
            buildListTile(cmd);
        }
    }
}
