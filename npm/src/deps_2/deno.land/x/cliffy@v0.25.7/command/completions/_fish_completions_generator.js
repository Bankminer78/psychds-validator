import { getDescription } from "../_utils.js";
import { FileType } from "../types/file.js";
/** Fish completions generator. */
export class FishCompletionsGenerator {
    cmd;
    /** Generates fish completions script for given command. */
    static generate(cmd) {
        return new FishCompletionsGenerator(cmd).generate();
    }
    constructor(cmd) {
        this.cmd = cmd;
    }
    /** Generates fish completions script. */
    generate() {
        const path = this.cmd.getPath();
        const version = this.cmd.getVersion()
            ? ` v${this.cmd.getVersion()}`
            : "";
        return `#!/usr/bin/env fish
# fish completion support for ${path}${version}

function __fish_${replaceSpecialChars(this.cmd.getName())}_using_command
  set -l cmds ${getCommandFnNames(this.cmd).join(" ")}
  set -l words (commandline -opc)
  set -l cmd "_"
  for word in $words
    switch $word
      case '-*'
        continue
      case '*'
        set word (string replace -r -a '\\W' '_' $word)
        set -l cmd_tmp $cmd"_$word"
        if contains $cmd_tmp $cmds
          set cmd $cmd_tmp
        end
    end
  end
  if test "$cmd" = "$argv[1]"
    return 0
  end
  return 1
end

${this.generateCompletions(this.cmd).trim()}`;
    }
    generateCompletions(command) {
        const parent = command.getParent();
        let result = ``;
        if (parent) {
            // command
            result += "\n" + this.complete(parent, {
                description: command.getShortDescription(),
                arguments: command.getName(),
            });
        }
        // arguments
        const commandArgs = command.getArguments();
        if (commandArgs.length) {
            result += "\n" + this.complete(command, {
                arguments: commandArgs.length
                    ? this.getCompletionCommand(command, commandArgs[0])
                    : undefined,
            });
        }
        // options
        for (const option of command.getOptions(false)) {
            result += "\n" + this.completeOption(command, option);
        }
        for (const subCommand of command.getCommands(false)) {
            result += this.generateCompletions(subCommand);
        }
        return result;
    }
    completeOption(command, option) {
        const shortOption = option.flags
            .find((flag) => flag.length === 2)
            ?.replace(/^(-)+/, "");
        const longOption = option.flags
            .find((flag) => flag.length > 2)
            ?.replace(/^(-)+/, "");
        return this.complete(command, {
            description: getDescription(option.description),
            shortOption: shortOption,
            longOption: longOption,
            // required: option.requiredValue,
            required: true,
            standalone: option.standalone,
            arguments: option.args.length
                ? this.getCompletionCommand(command, option.args[0])
                : undefined,
        });
    }
    complete(command, options) {
        const cmd = ["complete"];
        cmd.push("-c", this.cmd.getName());
        cmd.push("-n", `'__fish_${replaceSpecialChars(this.cmd.getName())}_using_command __${replaceSpecialChars(command.getPath())}'`);
        options.shortOption && cmd.push("-s", options.shortOption);
        options.longOption && cmd.push("-l", options.longOption);
        options.standalone && cmd.push("-x");
        cmd.push("-k");
        cmd.push("-f");
        if (options.arguments) {
            options.required && cmd.push("-r");
            cmd.push("-a", options.arguments);
        }
        if (options.description) {
            const description = getDescription(options.description, true)
                // escape single quotes
                .replace(/'/g, "\\'");
            cmd.push("-d", `'${description}'`);
        }
        return cmd.join(" ");
    }
    getCompletionCommand(cmd, arg) {
        const type = cmd.getType(arg.type);
        if (type && type.handler instanceof FileType) {
            return `'(__fish_complete_path)'`;
        }
        return `'(${this.cmd.getName()} completions complete ${arg.action + " " + getCompletionsPath(cmd)})'`;
    }
}
function getCommandFnNames(cmd, cmds = []) {
    cmds.push(`__${replaceSpecialChars(cmd.getPath())}`);
    cmd.getCommands(false).forEach((command) => {
        getCommandFnNames(command, cmds);
    });
    return cmds;
}
function getCompletionsPath(command) {
    return command.getPath()
        .split(" ")
        .slice(1)
        .join(" ");
}
function replaceSpecialChars(str) {
    return str.replace(/[^a-zA-Z0-9]/g, "_");
}
