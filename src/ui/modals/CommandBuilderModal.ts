import { stat, statSync } from "fs";
import { App, Modal, Notice, Setting } from "obsidian";

import { Command } from "@/command";

export class CommandBuilder extends Modal {
    result: Command;
    onCommit: (result: Command) => void;

    constructor(app: App, info?: Command, callback?: (result: Command) => void) {
        super(app);

        this.onCommit = callback ? callback : (result: Command) => { };
        this.result = info ? info : new Command();
    }

    onOpen() {
        const { contentEl } = this;

        /* Command Basics Area */
        contentEl.createEl("h1", { text: "Basics" })

        new Setting(contentEl)
            .setName("Command Name")
            .addText((text) => {
                if (this.result.name != "") {
                    text.setValue(this.result.name);
                } else {
                    text.setPlaceholder('Set Command Name here.')
                }

                text.onChange((value) => {
                    this.result.name = value;
                });
            });

        new Setting(contentEl)
            .setName('Resgister as Obsidian Command')
            .addToggle((toggle) => {
                toggle.setValue(this.result.obCmd);

                toggle.onChange((val) => this.result.obCmd = val);
            });

        new Setting(contentEl)
            .setName("Executable Path")
            .addText((text) => {
                if (this.result.executable != "") {
                    text.setValue(this.result.executable);
                } else {
                    text.setPlaceholder('Path to the executable')
                }

                text.onChange((value) => {
                    this.result.executable = value;
                });
            });


        new Setting(contentEl)
            .setName("Arguments")

            .addTextArea((text) => {
                if (this.result.arguments.length != 0) {
                    text.setValue(this.result.arguments);
                } else {
                    text.setPlaceholder('Arguments for the exe')
                }

                text.onChange((value) => {
                    this.result.arguments = value;
                });
            });

        new Setting(contentEl)
            .setName("CWD")
            .setTooltip("Current Working Directory")
            .addText((text) => {
                if (this.result.cwd != "") {
                    text.setValue(this.result.cwd);
                } else {
                    text.setPlaceholder('Path to the cwd')
                }

                text.onChange((value) => {
                    this.result.cwd = value;
                });
            });


        new Setting(contentEl)
            .addButton((btn) =>
                btn
                    .setButtonText("Save")
                    .setCta()
                    .onClick(async () => {
                        let cwdFailed = false;
                        let pathFailed = false;

                        /* check if cwd legal, blank is ok */
                        if (this.result.cwd != "") {
                            const stats = statSync(this.result.cwd, { throwIfNoEntry: false });

                            if (!stats) {
                                console.log(`Won't save cwd ${this.result.cwd}: Not a path`);
                                cwdFailed = true;
                            } else if (stats.isDirectory()) {
                                console.log(`Won't save cwd ${this.result.cwd}: Not a Directory`);
                                cwdFailed = true;
                            }

                        }

                        /* check if exe path legal */
                        const stats = statSync(this.result.executable, { throwIfNoEntry: false });

                        if (!stats) {
                            console.log(`Won't save path ${this.result.executable}: Not a path`);
                            pathFailed = true;
                        } else if (!stats.isFile()) {
                            console.log(`Won't save path ${this.result.executable}: Not a file`);
                            pathFailed = true;
                        }

                        if (!pathFailed && !cwdFailed) {
                            this.onCommit(this.result);
                            this.close();
                        } else {
                            // FIXME: should be more precise. figure out how to highlight unpassed options.

                            let errMsg = "Due to previous errors, the command info won't be saved.\n Errors are: ";
                            if (pathFailed) {
                                errMsg += "Executable Path "
                            }

                            if (cwdFailed) {
                                errMsg += "Cwd "
                            }

                            new Notice(errMsg);
                        }
                    }))

    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
