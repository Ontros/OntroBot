import { REST, Routes, SlashCommandOptionsOnlyBuilder } from 'discord.js';
import path from 'path';
require('dotenv').config({ path: path.join(__dirname + './../.env') });
const token = process.env.DJS_TOKEN;
const clientId = process.env.CLIENT_ID
if (!clientId) {
    throw new Error("no client")
}
if (!token) {
    throw new Error("no token")
}
const config = {
    token,
    clientId,
    guildId: '755839445051375779'
}
import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs'
import { CommandOptions } from './types';
import readAllCommands from './utils/readAllCommands';
// const commands = [];
// Grab all the command files from the commands directory you created earlier
// const commandFiles = fs.readdirSync('./commands').filter((file: string) => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
// for (const file of commandFiles) {
//     const command: CommandOptions = require(`./commands/${file}`);
//     //@ts-ignore
//     commands.push(command.data.toJSON());
// }
const commands = readAllCommands(__dirname)

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(config.token);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        //TODO: add name and description to data!!!!!!!!!!!!!!!!
        console.log(commands)
        const dataJSONs = commands.map((command) => { return (command.data as SlashCommandBuilder).toJSON() })
        console.log(dataJSONs)


        // The put method is used to fully refresh all commands in the guild with the current set
        const data: any = await rest.put(
            Routes.applicationGuildCommands(clientId, config.guildId),
            { body: dataJSONs },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
