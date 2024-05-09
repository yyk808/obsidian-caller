import { stat } from "fs";
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
                    .onClick(() => {
                        let failed = new Boolean(false);

                        /* check if cwd legal, blank is ok */
                        if (this.result.cwd != "") {
                            stat(this.result.cwd, (err: any, stats: { isDirectory: () => any; }) => {
                                if (err) {
                                    console.log(`Won't save ${this.result.cwd}: Not a path`);
                                    failed = true;
                                } else if (!stats.isDirectory()) {
                                    console.log(`Won't save ${this.result.cwd}: Not a Directory`);
                                    failed = true;
                                }
                            })
                        }

                        /* check if exe path legal */
                        stat(this.result.executable, (err: any, stats: { isFile: () => any; }) => {
                            if (err) {
                                console.log(`Won't save ${this.result.executable}: Not a path`);
                                failed = true;
                            } else if (!stats.isFile()) {
                                console.log(`Won't save ${this.result.executable}: Not a file`);
                                failed = true;
                            }
                        })

                        contentEl

                        if (!failed) {
                            console.log("Not failed");
                            this.onCommit(this.result);
                            this.close();
                        } else {
                            // FIXME: should be more precise. figure out how to highlight unpassed options.

                            console.log("Due to previous errors, the command info won't be saved.")
                            new Notice("Due to previous errors, the command info won't be saved.");
                        }
                    }))

    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();

    }
}
