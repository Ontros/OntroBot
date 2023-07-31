import { Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";
import progressBar from "../../utils/progressBar";
import language from "../../language";

module.exports = {
	commands: ["np", "nowPlaying"],
	expectedArgs: "<>",
	permissionError: "",
	minArgs: 0,
	maxArgs: 0,
	data: new SlashCommandBuilder(),
	isCommand: true,
	callback: async (message: Message, args: string[], text: string) => {
		//TODO: when loop random uses queue[0]
		if (!message.guild) { return }
		var server = global.servers[message.guild.id];
		if (!server.audioResource?.playbackDuration) {
			message.channel.send(language(message, "NO_PLAY"))
			return
		}
		const seconds = server.audioResource.playbackDuration / 1000;
		const durationO = server.queue[0].duration;
		if (!durationO) {
			throw Error("np.ts 17 WTFFFFFFFFFFFFFF")
		}
		const duration =
			durationO.seconds +
			durationO.minutes * 60 +
			durationO.hours * 60 * 60 +
			durationO.days * 60 * 60 * 24;
		message.channel.send({
			embeds: [progressBar(message,
				language(message, "NOW_PLAY"),
				`${server.queue[0].title}\n${language(message, "REQ_BY")}: ${server.queue[0].requestedBy
				}\n${secondsToString(seconds)}/${secondsToString(duration)}`,
				seconds / duration
			)]
		});
	},
	permissions: [],
	requiredRoles: [],
	allowedIDs: [],
} as CommandOptions
function secondsToString(seconds: number): string {
	if (seconds < 60 * 60) {
		return `${Math.floor(seconds / 60)}:${Math.floor(
			seconds % 60
		).toLocaleString("en-US", {
			minimumIntegerDigits: 2,
			useGrouping: false,
		})}`;
	} else {
		return "Time too big";
	}
}
