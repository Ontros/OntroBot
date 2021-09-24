import { Message } from "discord.js";

module.exports = {
	commands: ["np", "nowPlayin"],
	expectedArgs: "<>",
	permissionError: "",
	minArgs: 0,
	maxArgs: 0,
	callback: async (message: Message, args: string[], text: string) => {
		const { bot, lang } = global;
		if (!message.guild) { return }
		var server = global.servers[message.guild.id];
		const dispatcher = server.dispathcher;
		const seconds = (dispatcher.streamTime - dispatcher.pausedTime) / 1000;
		const durationO = server.queue[0].duration;
		const duration =
			durationO.seconds +
			durationO.minutes * 60 +
			durationO.hours * 60 * 60 +
			durationO.days * 60 * 60 * 24;
		message.channel.send(global.progressBar(message,
			lang(message.guild.id, "NOW_PLAY"),
			`${server.queue[0].title}\n${lang(message.guild.id, "REQ_BY")}: ${server.queue[0].requestedBy
			}\n${secondsToString(seconds)}/${secondsToString(duration)}`,
			seconds / duration
		)
		);
	},
	permissions: [],
	requiredRoles: [],
	allowedIDs: [],
};
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