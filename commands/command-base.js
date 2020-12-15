const prefix = '_';
const serverManager = require('.././server-manager');

const validatePermissions = (permissions) => {
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


module.exports = (bot, commandOptions) => {
    let {
        commands,
        expectedArgs = '',
        permissionError = 'Nemáš práva na tuhle komadnizaci!',
        minArgs = 0,
        maxArgs = null,
        permissions: [],
        requiredRoles: [],
        allowedIDs: [],
        callback,
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

        bot.on('message', message => {
            const {member, content, guild} = message
            try {
                serverManager(guild.id);
            }
            catch (err) {
                console.log('ERROR WITH LOADING SERVER --> STOPPING COMMAND')
                return
            }
            

            for (const alias of commands) {
                if (content.toLowerCase().split(/[ ]+/)[0] === `${prefix}${alias.toLowerCase()}`) {
                    for (const permission of commandOptions.permissions) {
                        if (!member.hasPermission(permission)) {
                            message.reply(permissionError)
                            return
                        }
                    }
                    for (const requiredRole of commandOptions.requiredRoles) {
                        const role = guild.role.cache.find(role => role.name == requiredRole)
                        if (!role || !member.roles.cache.has(role.id)) {
                            message.reply('Musíš mít roli ' + requiredRole)
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
                            message.reply('Nemáš práva plebe lol');
                            return;
                        }
                    }
                    const arguments = content.split(/[ ]+/)
                    arguments.shift()

                    if (arguments.length < minArgs || (maxArgs != null && arguments.length > maxArgs)) {
                        message.reply('Nesprávný formát! Použij: '+ prefix+alias+' '+expectedArgs);
                        return;
                    }

                    callback(message, arguments, arguments.join(' '), bot);

                    return;
                }
            }
        })
    
}