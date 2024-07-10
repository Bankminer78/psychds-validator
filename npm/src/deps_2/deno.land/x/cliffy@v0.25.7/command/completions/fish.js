import { Command } from "../command.js";
import { dim, italic } from "../deps.js";
import { FishCompletionsGenerator } from "./_fish_completions_generator.js";
/** Generates fish completions script. */
export class FishCompletionsCommand extends Command {
    #cmd;
    constructor(cmd) {
        super();
        this.#cmd = cmd;
        return this
            .description(() => {
            const baseCmd = this.#cmd || this.getMainCommand();
            return `Generate shell completions for fish.

To enable fish completions for this program add following line to your ${dim(italic("~/.config/fish/config.fish"))}:

    ${dim(italic(`source (${baseCmd.getPath()} completions fish | psub)`))}`;
        })
            .noGlobals()
            .action(() => {
            const baseCmd = this.#cmd || this.getMainCommand();
            console.log(FishCompletionsGenerator.generate(baseCmd));
        });
    }
}
