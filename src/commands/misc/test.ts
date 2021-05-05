import { Message } from "discord.js";

module.exports = {
    commands: ['test'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 1,
    permissions: [],
    requiredRoles: [],
    callback: async (message: Message, Arguments: string[], text: string) => {
        console.log(message.content)
        //const callback = (message: Message,message2:Message, reaction: MessageReaction) => {global.reactionForm(message,message2, 'test', 'lmao?', [{callback, title: 'ano'},{callback, title: 'ne'}/*,{callback, title: 'nea'},{callback, title: 'nve'},{callback, title: 'nce'}*/])}
        //global.reactionForm(message,null, 'test', 'lmao?', [{callback, title: 'ano'},{callback, title: 'ne'}/*,{callback, title: 'nea'},{callback, title: 'nve'},{callback, title: 'nce'}*/])
        // var output = await global.reactionForm(message, null, 'test', 'chceš si koupit chalst?', [{callback: null, title: 'ano'},{callback: null, title: 'ne'}])
        // if (!output) {return}
        // //console.log(output)
        // if (output.id === 0) {
        //     var output2 = await global.reactionForm(message, output.botMessage, 'test', 'je ti víc nez 18?', [{callback: null, title: 'ano'},{callback: null, title: 'ne'}])
        //     if (!output2) {return}
        //     if (output2.id === 0) {
        //         output2.botMessage.delete()
        //         message.channel.send('here ya go')
        //         return
        //     }
        // }
        // output.botMessage.delete()
        // message.channel.send('GTFO')
        // // var output = await global.textInput(message,null,'test','kde si našel tu kočku?')
        // console.log(output.text)
        // output.botMessage.delete()
    },
    allowedIDs: ['255345748441432064', '275639448299896833', '468845827352166430','630088178774179871']
}