import { Message, OverwriteResolvable, PermissionOverwriteOption, Role, Snowflake, TextChannel, VoiceChannel } from 'discord.js';
import { ReactionFormOption, ReactionFormOutput, Step } from '../../types';

module.exports = {
    commands: ['setup'],
    expectedArgs: '<>',
    permissionError: '',
    minArgs: 0,
    maxArgs: 0,
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return; }
        message.channel.send(global.lang(message.guild.id, 'SETUP_FUTURE'))
        // //todo check permissions lolmao
        // //TODO: mozna po text inputu se vezme output z obycejneho outputu ne z text outputu
        // const { bot, lang, reactionForm, textInput, buttonForm } = global
        // const server = global.servers[message.guild.id]
        // const YES_NO: ReactionFormOption[] = [{ callback: null, title: 'Yes' }, { callback: null, title: 'No' }]
        // const ALL_NO_TEXT: OverwriteResolvable = { id: message.guild.id, allow: [], deny: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'CREATE_INSTANT_INVITE', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'USE_EXTERNAL_EMOJIS', 'MENTION_EVERYONE', 'MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY', 'SEND_TTS_MESSAGES'] }//PermissionOverwriteOption[] = [{VIEW_CHANNEL: false}, {READ_MESSAGE_HISTORY: false}, {ADD_REACTIONS: false}, {SEND_MESSAGES: false}, {MANAGE_CHANNELS: false}, {MANAGE_ROLES: false}, {MANAGE_WEBHOOKS: false}, {CREATE_INSTANT_INVITE: false}, {EMBED_LINKS: false}, {ATTACH_FILES: false}, {USE_EXTERNAL_EMOJIS: false}, {MENTION_EVERYONE: false}, {MANAGE_MESSAGES: false}, {SEND_TTS_MESSAGES: false}]
        // const ALL_NO_VOICE: OverwriteResolvable = { id: message.guild.id, allow: ['SPEAK', 'USE_VAD', 'STREAM'], deny: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'CREATE_INSTANT_INVITE', 'CONNECT', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS'] }
        // const ALL_NO_TEXT_OPTION: PermissionOverwriteOption[] = [{ VIEW_CHANNEL: false }, { READ_MESSAGE_HISTORY: false }, { ADD_REACTIONS: false }, { SEND_MESSAGES: false }, { MANAGE_CHANNELS: false }, { MANAGE_ROLES: false }, { MANAGE_WEBHOOKS: false }, { CREATE_INSTANT_INVITE: false }, { EMBED_LINKS: false }, { ATTACH_FILES: false }, { USE_EXTERNAL_EMOJIS: false }, { MENTION_EVERYONE: false }, { MANAGE_MESSAGES: false }, { SEND_TTS_MESSAGES: false }]
        // const ALL_NO_VOICE_OPTION: PermissionOverwriteOption[] = [{ SPEAK: true }, { USE_VAD: true }, { STREAM: true }, { VIEW_CHANNEL: false }, { MANAGE_CHANNELS: false }, { MANAGE_ROLES: false }, { CREATE_INSTANT_INVITE: false }, { CONNECT: false }, { MUTE_MEMBERS: false }, { DEAFEN_MEMBERS: false }, { MOVE_MEMBERS: false }]
        // const CANT_WRITE_REACT: PermissionOverwriteOption[] = [{ VIEW_CHANNEL: true }, { READ_MESSAGE_HISTORY: true }, { ADD_REACTIONS: true }]

        // //var output = await buttonForm(message, null, 'Setup', 'Are you sure you want to? Your previos setup will be reset.', [{title:'Yes'},{title:'No'}])
        // var output = await reactionForm(message, null, 'Setup', 'Are you sure you want to? Your previous setup will be reset.\n(BTW I recommend using this command only in a private channel)', [{ callback: null, title: 'Yes' }, { callback: null, title: 'No' }])
        // //if (!output) {return}
        // if (output.id === 1) {
        //     //neche zacit
        //     output.botMessage.delete()
        //     return
        // }
        // //ROLE HIERARCHY
        // //TODO: I should be on top of all steps
        // var steps: (Step[] | null | undefined) = null
        // output = await reactionForm(message, output.botMessage, 'Setup', 'Do you want to use _upgrade and _downgrade?', YES_NO)
        // if (output.id === 0) {
        //     steps = await getSteps(message, output)
        // }
        // else {
        //     output = await reactionForm(message, output.botMessage, 'Setup', 'Do you want to use me for managing your channels', YES_NO)
        //     if (output.id === 0) {
        //         steps = await getSteps(message, output)
        //     }
        // }

        // //PERMISE
        // // var iHaveManage = false
        // // output = await reactionForm(message, output.botMessage, 'Setup', 'Do you want to use me for managing your channels (this will help during setup)', YES_NO)
        // // if (output.id === 0) {
        // //     iHaveManage = true

        // //can I get admin uwu owo plz?
        // if (!message.guild.me?.hasPermission('ADMINISTRATOR')) {
        //     output = await reactionForm(message, output.botMessage, 'Setup', 'Can you please give me administrator permissions and react to this message?', YES_NO)
        //     if (output.id === 0) {
        //         while (!message.guild.me?.hasPermission('ADMINISTRATOR')) {
        //             output = await reactionForm(message, output.botMessage, 'Setup', 'You did not give me administrator permission. Try it again', YES_NO)
        //             if (output.id === 1) {
        //                 break
        //             }
        //         }
        //     }
        // }
        // //ano -> wiiiiiiiii
        // //no -> 
        // if (!message.guild.me?.hasPermission('ADMINISTRATOR')) {
        //     //Permisse v roomce:

        //     //Permisse v serveru:
        //     //vytvoreni kanalu
        //     while (!message.guild.me?.hasPermission('MANAGE_CHANNELS')) {
        //         output = await reactionForm(message, output.botMessage, 'Setup', 'I do not have permission to manage channels! Give me it and react to this message.', YES_NO)
        //         if (output.id === 1) {
        //             output.botMessage.delete()
        //             message.channel.send('Ok, exiting')
        //             return
        //         }
        //     }
        //     //uprava roli
        //     while (!message.guild.me?.hasPermission('MANAGE_ROLES')) {
        //         output = await reactionForm(message, output.botMessage, 'Setup', 'I do not have permission to manage roles! Give me it and react to this message.', YES_NO)
        //         if (output.id === 1) {
        //             output.botMessage.delete()
        //             message.channel.send('Ok, exiting')
        //             return
        //         }
        //     }

        //     //Vidim vsechny roomky?
        //     while (true) {
        //         var roomsString = 'If not, answer after providing me with permissions to see all of the rooms on the server (view channel, manage channel, manage permissions, send messages, embed links, add reactions, manage messages, use slash commands) If you do not want to, answer no and do _setup but give me administrator (I`ll do it for you :wink:).\n';
        //         var rooms = (await message.guild.fetch()).channels.cache.array().filter(room => { return room.type !== 'category' }).sort((a, b) => { return a.rawPosition - b.rawPosition })
        //         var textRooms = rooms.filter(room => room.type === 'text')
        //         var voiceRooms = rooms.filter(room => room.type === 'voice')

        //         roomsString += '**Text Channels:**\n'
        //         for (var room of textRooms) {
        //             roomsString += room.name + '\n'
        //         }
        //         roomsString += '\n**Voice Channels:**\n'
        //         for (var room of voiceRooms) {
        //             roomsString += room.name + '\n'
        //         }

        //         var roomsMessage = await message.channel.send(roomsString).catch((e: any) => {
        //             console.log(e);
        //             if (!message.guild) { return 404 }
        //             message.channel.send(lang(message.guild.id, "UNKWN_ERR"))
        //             output.botMessage.delete()
        //             return 404
        //         })
        //         if (roomsMessage === 404 || typeof roomsMessage === 'number') { message.channel.send(lang(message.guild.id, 'UNKWN_ERR')); output.botMessage.delete(); return }
        //         output = await reactionForm(message, output.botMessage, 'Setup', 'Are the rooms in the message bellow all of the rooms on the server?', YES_NO)
        //         roomsMessage.delete()
        //         if (output.id === 0) {
        //             break
        //         }
        //     }

        // }
        // //}



        // // if (!steps) { message.channel.send(lang(message.guild.id, 'UNKWN_ERR')); return }
        // // global.servers[message.guild.id].steps = steps;

        // //RULES CHANNEL?
        // output = await reactionForm(message, output.botMessage, 'Setup - Rules channel', 'Do you want to have a rules channel?', [{ callback: null, title: 'Yes' }, { callback: null, title: 'No' }])
        // if (output.id === 0) {
        //     var ruleRole: (Role | null) = null;
        //     //Get rule role
        //     output = await reactionForm(message, output.botMessage, 'Setup - Rules channel', 'Do you require for users to accept the rules before being able to acces the server?', [{ callback: null, title: 'Yes' }, { callback: null, title: 'No' }])
        //     if (output.id === 0) {
        //         if (!steps) {
        //             steps = await getSteps(message, output)
        //         }
        //         ruleRole = await message.guild.roles.fetch(steps[0].id)
        //     }

        //     output = await reactionForm(message, output.botMessage, 'Setup - Rules channel', 'Do you want to create the channel?', [{ callback: null, title: 'Yes, create' }, { callback: null, title: 'No, I already have a channel and I want to use it' }])
        //     //Create channel
        //     var rulesChannel: (TextChannel | null) = null
        //     if (output.id === 0) {
        //         //name
        //         var textInputOutput = await textInput(message, output.botMessage, 'Setup - Rules channel', 'What should it be named?', null)
        //         const rulesChannelName = textInputOutput.text
        //         //create
        //         rulesChannel = await message.guild.channels.create(rulesChannelName, { reason: 'Created through setup', permissionOverwrites: [ALL_NO_TEXT] })
        //         if (!rulesChannel) { lang(message.guild.id, 'UNKWN_ERR'); return }
        //         message.guild.rulesChannelID = rulesChannel.id
        //     }
        //     else if (output.id === 1) {
        //         //mention it
        //         var textInputOutput = await textInput(message, output.botMessage, 'Setup - Rules channel', 'Mention the channel or write ID', async (input) => { return !!await global.getTextChannel(message, input) })
        //         textInputOutput.inputMessage.delete()
        //         while (true) {
        //             rulesChannel = await global.getTextChannel(message, textInputOutput.text)
        //             if (rulesChannel) {
        //                 break
        //             }
        //             var textInputOutput = await textInput(message, output.botMessage, 'Setup - Rules channel', 'Mention the channel or write ID\nError, try again!', async (input) => { return !!await global.getTextChannel(message, input) })
        //             textInputOutput.inputMessage.delete()
        //         }
        //     }
        //     //Create message
        //     textInputOutput = await textInput(message, output.botMessage, 'Setup - Rules channel', 'What should the title be?', null)
        //     textInputOutput.inputMessage.delete();
        //     const title = textInputOutput.text;
        //     textInputOutput = await textInput(message, output.botMessage, 'Setup - Rules channel', 'What are your rules? (use Shift+Enter to create new line)', null)
        //     textInputOutput.inputMessage.delete();
        //     if (!rulesChannel) { console.log('channel not'); return }
        //     const ruleMess = await rulesChannel.send(global.createEmbed(output.botMessage, title, textInputOutput.text, [], 'https://cdn.discordapp.com/attachments/275647884332892163/837210108693708830/white-heavy-check-mark-emoji-by-twitter.png'))
        //     await ruleMess.react('✅');
        //     // const filter: CollectorFilter = (reaction: MessageReaction, user: User) => {
        //     //     console.log(reaction.emoji.name === '✅')
        //     //     return reaction.emoji.name === '✅'
        //     // }
        //     //Save to server
        //     server.config.rules.channelID = rulesChannel.id
        //     server.config.rules.roleID = ruleRole?.id ? ruleRole.id : null
        //     global.serverManager(message.guild.id, true)
        //     //Do you want me to handle permissions?
        //     output = await reactionForm(message, output.botMessage, 'Setup - Rules channel', 'Should I handle permissions?', YES_NO)
        //     if (output.id === 1) {
        //         CANT_WRITE_REACT.forEach(overirde => rulesChannel?.updateOverwrite(rulesChannel.guild.roles.everyone, overirde))
        //     }
        // }

        // output = await reactionForm(message, output.botMessage, 'Setup', 'Do you want to have "cekarna?"', [{ callback: null, title: 'Yes' }, { callback: null, title: 'No' }])
        // if (output.id === 0) {
        //     //CEKARNA:
        //     //Cekarna channel:
        //     output = await reactionForm(message, output.botMessage, 'Setup - Cekarna', 'Should I create the voice channel?', [{ callback: null, title: 'Yes' }, { callback: null, title: 'No' }])
        //     var cekarnaVoiceChannel: (VoiceChannel | null) = null
        //     var cekarnaTextChannel: (TextChannel | null) = null
        //     if (output.id === 0) {
        //         //name
        //         var textInputOutput = await textInput(message, output.botMessage, 'Setup - Cekarna voice channel', 'What should it be named?', null)
        //         const cekarnaChannelName = textInputOutput.text
        //         //create
        //         cekarnaVoiceChannel = await message.guild.channels.create(cekarnaChannelName, { type: 'voice', reason: 'Created through setup', permissionOverwrites: [ALL_NO_VOICE] })
        //         if (!cekarnaVoiceChannel) { lang(message.guild.id, 'UNKWN_ERR'); return }
        //     }
        //     else if (output.id === 1) {
        //         //mention it
        //         var textInputOutput = await textInput(message, output.botMessage, 'Setup - Cekarna voice channel', 'Mention the channel or write ID', async (input) => { return !!await global.getTextChannel(message, input) })
        //         textInputOutput.inputMessage.delete()
        //         while (true) {
        //             cekarnaVoiceChannel = await global.getVoiceChannel(message, textInputOutput.text)
        //             if (cekarnaVoiceChannel) {
        //                 break
        //             }
        //             var textInputOutput = await textInput(message, output.botMessage, 'Setup - Cekarna voice channel', 'Mention the channel or write ID\nError, try again!', async (input) => { return !!await global.getTextChannel(message, input) })
        //             textInputOutput.inputMessage.delete()
        //         }
        //         ALL_NO_VOICE_OPTION.forEach(overirde => cekarnaVoiceChannel?.updateOverwrite(cekarnaVoiceChannel.guild.roles.everyone, overirde))
        //     }
        //     //Cekarna input text channel
        //     output = await reactionForm(message, output.botMessage, 'Setup - Cekarna', 'Should I create the text channel?', [{ callback: null, title: 'Yes' }, { callback: null, title: 'No' }])
        //     if (output.id === 0) {
        //         //name
        //         var textInputOutput = await textInput(message, output.botMessage, 'Setup - Cekarna text channel', 'What should it be named?', null)
        //         const cekarnaChannelName = textInputOutput.text
        //         //create
        //         cekarnaTextChannel = await message.guild.channels.create(cekarnaChannelName, { type: 'text', reason: 'Created through setup', permissionOverwrites: [ALL_NO_VOICE] })
        //         if (!cekarnaTextChannel) { lang(message.guild.id, 'UNKWN_ERR'); return }
        //     }
        //     else if (output.id === 1) {
        //         //mention it
        //         var textInputOutput = await textInput(message, output.botMessage, 'Setup - Cekarna text channel', 'Mention the channel or write ID', async (input) => { return !!await global.getTextChannel(message, input) })
        //         textInputOutput.inputMessage.delete()
        //         while (true) {
        //             cekarnaTextChannel = await global.getTextChannel(message, textInputOutput.text)
        //             if (cekarnaTextChannel) {
        //                 break
        //             }
        //             var textInputOutput = await textInput(message, output.botMessage, 'Setup - Cekarna text channel', 'Mention the channel or write ID\nError, try again!', async (input) => { return !!await global.getTextChannel(message, input) })
        //             textInputOutput.inputMessage.delete()
        //         }
        //         ALL_NO_VOICE_OPTION.forEach(overirde => cekarnaVoiceChannel?.updateOverwrite(cekarnaVoiceChannel.guild.roles.everyone, overirde))
        //     }
        //     //Do you want to manage permissions by me?
        // }
        // //TODO: Temporariry channels
        // // output = await reactionForm(message, output.botMessage, 'Setup', 'Do you want to have temporariry channels?', YES_NO)
        // // if (output.id === 0) {
        // //     if (!steps) {
        // //         steps = await getSteps(message, output)
        // //     }
        // // }

        // //TODO: Cekarna
        // // output = await reactionForm(message, output.botMessage, 'Setup', 'Do you want to have cekarna?', YES_NO)
        // // if (output.id === 0) {
        // //     //CAPECEK JOINE -> where do you want to join
        // // }

        // //Inform about new features?
        // //Create channels??
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
    allowedIDs: [],
}

async function getSteps(message: Message, output: ReactionFormOutput): Promise<Step[]> {
    var textInputOutput = await global.textInput(message, output.botMessage, 'Setup - Role hierarchy', 'Mention all roles that are used for giving different permissions on your server, excluding bot roles (role hierarchy) in ascending order of importance (example input: @Basic @VIP @Mod @Owner)', null)
    var steps: Step[] | null = []
    while (true) {
        var textArgs = textInputOutput.text.split(/[ ]+/)
        steps = await getStepArray(textInputOutput.inputMessage, textArgs)
        if (steps) {
            break
        }
        var textInputOutput = await global.textInput(message, output.botMessage, 'Setup - Role hierarchy', 'Mention all roles that are used for giving different permissions on your server, excluding bot roles (role hierarchy) in ascending order of importance (example input: @Basic @VIP @Mod @Owner)\n Error, try again!', null)
    }
    return steps

}

async function getStepArray(message: Message, textArgs: Snowflake[]) {
    if (!message.guild) { return null }
    const steps: Step[] = []
    await message.guild.roles.fetch()
    //for (var id in textArgs) {
    textArgs.forEach(async id => {
        if (!message.guild) { return }
        // console.log(id)
        if (!message.guild.roles.cache.get(id)) {
            //Not directly ID
            id = id.substring(3, textArgs[0].length - 1)
            if (!message.guild.roles.cache.get(id)) {
                message.reply(global.lang(message.guild.id, 'ROLE_ID_NOT'));
                throw new Error('ROLE_ID_NOT')
            }
        }
        const Role = await message.guild.roles.fetch(id)
        if (!Role) { message.reply(global.lang(message.guild.id, 'ROLE_ID_NOT')); return }
        var step: Step = {
            id,
            name: Role.name,
            emoji: Role.name.split(' ')[0]
        }
        steps.push(step)
    })
    return steps
}
//const everyoneRuleChannelPerm = rulesChannel.permissionsFor((await message.guild.roles.fetch()).everyone)
//var permissions: PermissionOverwriteOption[] = [{VIEW_CHANNEL: true}, {READ_MESSAGE_HISTORY: true}, {ADD_REACTIONS: true}, {SEND_MESSAGES: false}]
//permissions.forEach(overirde => rulesChannel.updateOverwrite(rulesChannel.guild.roles.everyone, overirde))
//if (!everyoneRuleChannelPerm) {console.error('failed to find everyone role in setup'); return}
//rulesChannel.updateOverwrite(permissions)
// if (output.id === 0) {
            //     if (!steps) {
            //         output = await reactionForm(message, output.botMessage, 'Setup - Rules channel', 'Should I create the role?', YES_NO)
            //         if (output.id === 0) {
            //             //CREATE ROLE
            //             var textInputOutput = await textInput(message, output.botMessage, 'Setup - Rules channel', 'What should it be named?', null)
            //             textInputOutput.inputMessage.delete()
            //             ruleRole = await message.guild.roles.create({
            //                 data: {
            //                     name: textInputOutput.text
            //                 }
            //             })
            //         }
            //         else {
            //             //Ping role
            //             var textInputOutput = await textInput(message, output.botMessage, 'Setup - Rules channel', 'Mention the role or write ID', async (input) => { return !!await global.getRole(message, input) })
            //             textInputOutput.inputMessage.delete()
            //             while (true) {
            //                 ruleRole = await global.getRole(message, textInputOutput.text)
            //                 if (ruleRole) {
            //                     break
            //                 }
            //                 var textInputOutput = await textInput(message, output.botMessage, 'Setup - Rules channel', 'Mention the role or write ID\nError, try again!', async (input) => { return !!await global.getRole(message, input) })
            //                 textInputOutput.inputMessage.delete()
            //             }
            //     else {
            //         //ruleRole = steps[0];
            //     }
            // }