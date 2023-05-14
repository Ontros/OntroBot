import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import fs from 'fs'
import path from 'path';
import { Command, CommandOptions, SubcommandContainer, SubcommandContainerOptions } from '../types';
import camelToWords from './camelToWords';

export default (baseDir: string) => {
    const base_file = 'command-base.js'
    const commands: (Command | SubcommandContainer)[] = []
    const langJ = require('./../../language.json')
    const readCommands = (dir: string) => {
        const files = fs.readdirSync(path.join(baseDir, dir));
        for (const file of files) {
            const stat = fs.lstatSync(path.join(baseDir, dir, file));
            if (stat.isDirectory()) {
                //Dir
                if (!fs.existsSync(path.join(dir, file + '.js')))
                    readCommands(path.join(dir, file));
            } else if (file != base_file) {
                //File
                const option: CommandOptions | SubcommandContainerOptions = require(path.join(baseDir, dir, file));
                if (!option.data) {
                    continue
                }
                const translations = langJ.translations[`DES_${file.split('.')[0].toUpperCase()}_SHORT`];
                console.log(translations, file.toUpperCase());
                (option.data as SlashCommandBuilder).setName(camelToWords(file.split('.')[0]).toLowerCase().replace(".", "").replace(" ", ""))
                    .setDescription(translations['english'])
                // .setDescriptionLocalizations({ "cs": translations['czech'], "en-GB": translations['english'] })
                if (option.isCommand) {
                    //Command
                    commands.push({ ...option, name: camelToWords(file.split('.')[0]) })
                }
                else if (!option.isCommand) {
                    //Subcommand container
                    console.log(option.isCommand)
                    const subcommands = fs.readdirSync(path.join(baseDir, dir, file.split('.')[0]))
                    const command: SubcommandContainerOptions = (option as SubcommandContainerOptions)
                    for (const subcommandName of subcommands) {
                        const subcommand: CommandOptions = require(path.join(baseDir, dir, file.split('.')[0], subcommandName));
                        const translationsSubcommand = langJ.translations[`DES_${subcommandName.split('.')[0].toUpperCase()}_SHORT`];
                        if (subcommand.data)
                            (command.data as SlashCommandBuilder).addSubcommand((subcommand.data as SlashCommandSubcommandBuilder).setName(subcommandName.split('.')[0].toLowerCase())
                                // .setDescriptionLocalizations({ "cs": translationsSubcommand['czech'], "en-GB": translationsSubcommand['english'] }))
                                .setDescription(translationsSubcommand['english']))

                    }
                    commands.push({ ...command, name: camelToWords(file.split('.')[0]) })
                }
            }
        }
    }
    readCommands("commands")
    return commands
}