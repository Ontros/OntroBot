import { EmbedBuilder, Message, SlashCommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../types";
import language, { languageI } from "../../language";
import db from "../../database";

const getCountingState = db.prepare(`SELECT channel_id FROM counting_state WHERE guild_id = ?`);
const resetCounting = db.prepare(`UPDATE counting_state SET current_count = 0, last_user = NULL WHERE guild_id = ?`);

export default {
    commands: ['countingreset', 'creset'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    permissions: ["ADMINISTRATOR"],
    requiredRoles: [],
    allowedIDs: [],
    isCommand: true,
    data: new SlashCommandBuilder(),
    execute: async (interaction) => {
        if (!interaction.guildId) return;
        const state = getCountingState.get(interaction.guildId) as any;
        if (!state) {
            await interaction.reply(languageI(interaction, 'COUNT_RESET_NONE'));
            return;
        }
        resetCounting.run(interaction.guildId);
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Counting')
            .setDescription(languageI(interaction, 'COUNT_RESET_DONE'));
        await interaction.reply({ embeds: [embed] });
    },
    callback: async (message: Message) => {
        if (!message.guildId) return;
        const state = getCountingState.get(message.guildId) as any;
        if (!state) {
            await (message.channel as TextChannel).send(language(message, 'COUNT_RESET_NONE'));
            return;
        }
        resetCounting.run(message.guildId);
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Counting')
            .setDescription(language(message, 'COUNT_RESET_DONE'));
        await (message.channel as TextChannel).send({ embeds: [embed] });
    }
} as CommandOptions;
