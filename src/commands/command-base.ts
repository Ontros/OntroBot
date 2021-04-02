import { Message, Role } from "discord.js";
import { CommandOptions } from "../types";

const prefix = '_';
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


module.exports = async (commandOptions : CommandOptions, file: any) => {
    if (!commandOptions.callback) {console.log('error loading: ');console.log(file); return}
    let {
        commands,
        expectedArgs = '',
        permissionError = 'Nemáš práva na tuhle komadnizaci!',
        minArgs = 0,
        maxArgs = null,
        permissions: [],
        requiredRoles: [],
        allowedIDs: [],
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

        global.bot.on('message', async(message: Message) => {
            const {member, content, guild, channel} = message
            const {lang} = global;
            if (!guild || !message.guild) {
                //console.log("DM");
                return;
            }
            try {
                //console.log(guild.id);
                global.serverManager(message.guild.id);  
            }
            catch (err) {
                console.log('ERROR WITH LOADING SERVER --> STOPPING COMMAND ' +err)
                return
            }
            
            if(!member || !guild.me) {
                message.channel.send(lang(guild.id, 'USR_ID_NOT'))
                return;
            }

            for (const alias of commands) {
                if (content.toLowerCase().split(/[ ]+/)[0] === `${prefix}${alias.toLowerCase()}`) {
                    for (const permission of commandOptions.permissions) {
                        if (!member.hasPermission(permission)) {
                            message.reply(lang(guild.id, 'CMD_NO_PERM'))
                            return
                        }
                    }
                    for (const requiredRole of commandOptions.requiredRoles) {
                        const role = (await guild.roles.fetch()).cache.find((role:Role) => role.name == requiredRole);
                        if (!role || !member.roles.cache.has(role.id)) {
                            message.reply(lang(guild.id, 'ROLE_RQR')[0] + requiredRole+lang(guild.id, 'ROLE_RQR')[0])
                            return
                        }
                    }
                    
                    if (commandOptions.allowedIDs.length != 0) {
                        var isAllowed = false;
                        for (const username of commandOptions.allowedIDs) {
                            if (username === message.author.id) {
                                isAllowed = true
                            }
                        }
                        if (!isAllowed) {
                            message.reply(lang(guild.id, 'CMD_NO_PERM'))
                            return;
                        }
                    }

                    
                    if (commandOptions.allowedServer != guild.id.toString() && commandOptions.allowedServer != '') {
                        //console.log('not allowed server');
                        //return;
                    }
                        
                    const Arguments = content.split(/[ ]+/)
                    Arguments.shift()

                    if (Arguments.length < minArgs || (maxArgs != null && Arguments.length > maxArgs)) {
                        message.reply(lang(guild.id, 'INC_FORM')+': '+ prefix+alias+' '+expectedArgs);
                        return;
                    }

                    const botPermissionsIn = guild.me.permissionsIn(channel);
                    if (!botPermissionsIn.has('SEND_MESSAGES')) {
                        member.user.send(lang(guild.id, 'NO_WRITE_PERM'));
                        return;
                    }

                    if (!botPermissionsIn.has('EMBED_LINKS')) {
                        channel.send(lang(guild.id, 'NO_EMBED_PERM'));
                        return;
                    }

                    if (commandOptions.requireChannelPerms) {
                        if (!member.voice.channel) {
                            message.channel.send(lang(guild.id, 'NOT_IN_VC'))
                            return
                        }
                        const permissionsInVoice = guild.me.permissionsIn(member.voice.channel);

                        if (!permissionsInVoice.has('CONNECT')) {
                            channel.send(lang(guild.id, 'NO_JOIN_PERM'));
                            return;
                        }

                        if (!permissionsInVoice.has('SPEAK')) {
                            channel.send(lang(guild.id, 'NO_SPEAK_PERM'));
                            return;
                        }
                    }
                    try {
                        callback(message, Arguments, Arguments.join(' '));
                    }
                    catch (e){
                        console.log(e);
                        message.channel.send(lang(guild.id, "UNKWN_ERR"))
                    }

                    return;
                }
            }
        })
    
}