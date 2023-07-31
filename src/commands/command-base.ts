import { Message, Role } from "discord.js";
import { CommandOptions } from "../types";
import languageDATA from "../languageDATA";
import serverManager from "../server-manager";
import language from "../language";

// const prefix = '_';
//const serverManager = require('.././server-manager');

const validatePermissions = (permissions: string[]) => {
    const validPermissions = [
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'ADMINISTRATOR',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS',
    ]
    for (const permission of permissions) {
        if (!validPermissions.includes(permission)) {
            throw new Error(`Unknown permission node "${permission}"`)
        }
    }
}


export default async (commandOptions: CommandOptions, file: string) => {
    if (!commandOptions.callback) { console.log('error loading: '); console.log(file); return }
    let {
        commands,
        expectedArgs = '',
        permissionError = 'Nemáš práva na tuhle komadnizaci!',
        minArgs = 0,
        maxArgs = null,
        permissions: [],
        requiredRoles: [],
        allowedIDs: undefined,
        allowedServer = '',
        callback,
        requireChannelPerms = false,
    } = commandOptions

    if (typeof commands === 'string') {
        commands = [commands];
    }

    if (commandOptions.permissions.length) {
        if (typeof commandOptions.permissions === 'string') {
            commandOptions.permissions = [commandOptions.permissions]
        }

        validatePermissions(commandOptions.permissions)
    }

    //Get aliases:
    var aliases
    if (typeof commands === 'string') {
        aliases = commands
    }
    else {
        aliases = commands.join(', ')
    }

    //create command (for help):
    var paths: string[] = []
    if (file.includes("\\")) {
        //Windows
        paths = file.split("\\")
    }
    else {
        //Linux
        paths = file.split("/")
    }

    const name = paths[paths.length - 1].split('.')[0]
    const catName = paths[paths.length - 2] //category name


    var catIgnore = ['remainders']

    function isIgnored(arg0: string) {
        for (var ignore of catIgnore) {
            if (ignore === arg0) {
                return true
            }
        }
        return false
    }

    //HELP commands
    if (!isIgnored(catName)) {
        if (!global.commands[catName]) {
            //Create category
            global.commands[catName] = {
                name: camelToWords(catName),
                commands: {}
            }
            //Test if lang for category exists
            if (!(languageDATA.translations as any)[`${catName.toUpperCase()}_DES`]) {
                console.error(`No translation for ${catName} description`)
            }
        }
        //Create command
        global.commands[catName].commands[name] = {
            name: camelToWords(name),
            aliases: commandOptions.commands.toString(),
            args: commandOptions.expectedArgs,
        }
        if (!(languageDATA.translations as any)[`DES_${name.toUpperCase()}_SHORT`] || !(languageDATA.translations as any)[`DES_${name.toUpperCase()}_LONG`]) {
            console.error(`No translation for ${name} description`)
        }
    }



    global.bot.on('messageCreate', async (message: Message) => {
        const { member, content, guild, channel } = message
        const { bot } = global;
        if (!guild || !message.guild || channel.isDMBased()) {
            return;
        }
        try {
            serverManager(message.guild.id);
        }
        catch (err) {
            console.log('ERROR WITH LOADING SERVER --> STOPPING COMMAND ', err)
            return
        }

        var prefix = global.servers[message.guild.id].prefix
        // var prefix = "_"

        if (!member || !guild.client) {
            message.channel.send(language(message, 'USR_ID_NOT'))
            return;
        }

        for (const alias of commands) {
            if (content.toLowerCase().split(/[ ]+/)[0] === `${prefix}${alias.toLowerCase()}`) {
                for (const permission of commandOptions.permissions) {
                    if (!member.permissions.has(permission)) {
                        message.reply(language(message, 'CMD_NO_PERM'))
                        return
                    }
                }
                for (const requiredRole of commandOptions.requiredRoles) {
                    const role = (await guild.roles.fetch()).find((role: Role) => role.name == requiredRole);
                    if (!role || !member.roles.cache.has(role.id)) {
                        message.reply(language(message, 'ROLE_RQR')[0] + requiredRole + language(message, 'ROLE_RQR')[0])
                        return
                    }
                }

                if (!!commandOptions.allowedIDs && commandOptions.allowedIDs.length != 0) {
                    var isAllowed = false;
                    for (const username of commandOptions.allowedIDs) {
                        if (username === message.author.id) {
                            isAllowed = true
                        }
                    }
                    if (!isAllowed) {
                        message.reply(language(message, 'CMD_NO_PERM'))
                        return;
                    }
                }


                // if (commandOptions.allowedServer != guild.id.toString() && commandOptions.allowedServer != '') {
                //     //console.log('not allowed server');
                //     //return;
                // }

                const Arguments = content.split(/[ ]+/)
                Arguments.shift()

                if (Arguments.length < minArgs || (maxArgs != null && Arguments.length > maxArgs)) {
                    message.reply(language(message, 'INC_FORM') + ': ' + prefix + alias + ' ' + expectedArgs);
                    return;
                }

                if (!bot.user || !bot.user.id || !bot) {
                    console.log("bot has no id")
                    return
                }
                const botMember = message.guild.members.cache.get(bot.user.id)
                if (!botMember) {
                    console.log("bot is not a member")
                    return
                }
                const botPermissionsIn = botMember.permissionsIn(channel);
                if (!botPermissionsIn.has('SendMessages')) {
                    member.user.send(language(message, 'NO_WRITE_PERM'));
                    return;
                }

                if (!botPermissionsIn.has('EmbedLinks')) {
                    channel.send(language(message, 'NO_EMBED_PERM'));
                    return;
                }

                if (!botPermissionsIn.has('ManageMessages')) {
                    message.channel.send(language(message, 'NO_MANAGE_MESSAGES_PERM'))
                    return
                }

                if (!botPermissionsIn.has('AddReactions')) {
                    message.channel.send(language(message, 'NO_ADD_REACTIONS_PERM'))
                    return
                }

                if (commandOptions.requireChannelPerms) {
                    if (!member.voice.channel) {
                        message.channel.send(language(message, 'NOT_IN_VC'))
                        return
                    }
                    const permissionsInVoice = botMember.permissionsIn(member.voice.channel);

                    if (!permissionsInVoice.has('Connect')) {
                        channel.send(language(message, 'NO_JOIN_PERM'));
                        return;
                    }

                    if (!permissionsInVoice.has('Speak')) {
                        channel.send(language(message, 'NO_SPEAK_PERM'));
                        return;
                    }
                }

                callback(message, Arguments, Arguments.join(' ')).catch((e: any) => {
                    console.log(e);
                    message.channel.send(language(message, "UNKWN_ERR"))
                })

                return;
            }
        }
    })

}
function camelToWords(text: string) {
    var result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}