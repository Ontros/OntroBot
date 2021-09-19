import { Message } from 'discord.js';
import { Job } from 'node-schedule';
import { ReactionFormOption, ScheaduledTime } from '../../types';
import timeToDate from '../../utils/timeToDate';
// ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
// ─██████████████───██████████████─██████──────────██████─██████████████─████████████████───██████████████────██████████████───██████████████─████████████───
// ─██░░░░░░░░░░██───██░░░░░░░░░░██─██░░██──────────██░░██─██░░░░░░░░░░██─██░░░░░░░░░░░░██───██░░░░░░░░░░██────██░░░░░░░░░░██───██░░░░░░░░░░██─██░░░░░░░░████─
// ─██░░██████░░██───██░░██████████─██░░██──────────██░░██─██░░██████░░██─██░░████████░░██───██░░██████████────██░░██████░░██───██░░██████░░██─██░░████░░░░██─
// ─██░░██──██░░██───██░░██─────────██░░██──────────██░░██─██░░██──██░░██─██░░██────██░░██───██░░██────────────██░░██──██░░██───██░░██──██░░██─██░░██──██░░██─
// ─██░░██████░░████─██░░██████████─██░░██──██████──██░░██─██░░██████░░██─██░░████████░░██───██░░██████████────██░░██████░░████─██░░██████░░██─██░░██──██░░██─
// ─██░░░░░░░░░░░░██─██░░░░░░░░░░██─██░░██──██░░██──██░░██─██░░░░░░░░░░██─██░░░░░░░░░░░░██───██░░░░░░░░░░██────██░░░░░░░░░░░░██─██░░░░░░░░░░██─██░░██──██░░██─
// ─██░░████████░░██─██░░██████████─██░░██──██░░██──██░░██─██░░██████░░██─██░░██████░░████───██░░██████████────██░░████████░░██─██░░██████░░██─██░░██──██░░██─
// ─██░░██────██░░██─██░░██─────────██░░██████░░██████░░██─██░░██──██░░██─██░░██──██░░██─────██░░██────────────██░░██────██░░██─██░░██──██░░██─██░░██──██░░██─
// ─██░░████████░░██─██░░██████████─██░░░░░░░░░░░░░░░░░░██─██░░██──██░░██─██░░██──██░░██████─██░░██████████────██░░████████░░██─██░░██──██░░██─██░░████░░░░██─
// ─██░░░░░░░░░░░░██─██░░░░░░░░░░██─██░░██████░░██████░░██─██░░██──██░░██─██░░██──██░░░░░░██─██░░░░░░░░░░██────██░░░░░░░░░░░░██─██░░██──██░░██─██░░░░░░░░████─
// ─████████████████─██████████████─██████──██████──██████─██████──██████─██████──██████████─██████████████────████████████████─██████──██████─████████████───
// ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// ─██████████████─██████████████─████████████───██████████████─
// ─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░░░████─██░░░░░░░░░░██─
// ─██░░██████████─██░░██████░░██─██░░████░░░░██─██░░██████████─
// ─██░░██─────────██░░██──██░░██─██░░██──██░░██─██░░██─────────
// ─██░░██─────────██░░██──██░░██─██░░██──██░░██─██░░██████████─
// ─██░░██─────────██░░██──██░░██─██░░██──██░░██─██░░░░░░░░░░██─
// ─██░░██─────────██░░██──██░░██─██░░██──██░░██─██░░██████████─
// ─██░░██─────────██░░██──██░░██─██░░██──██░░██─██░░██─────────
// ─██░░██████████─██░░██████░░██─██░░████░░░░██─██░░██████████─
// ─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░░░████─██░░░░░░░░░░██─
// ─██████████████─██████████████─████████████───██████████████─
// ─────────────────────────────────────────────────────────────


module.exports = {
    commands: ['addRemainder', 'addRem'],
    expectedArgs: '<>',
    permissionError: '',
    minArgs: 0,
    maxArgs: 0,
    callback: async (message: Message, args: string[], text: string) => {
        //TEMPORARIbasfa (spelling be like): until move to site
        const { bot, lang, reactionForm, textInput } = global
        if (!message.guild) { return; }
        const YES_NO: ReactionFormOption[] = [{ callback: null, title: 'Yes' }, { callback: null, title: 'No' }]

        var remainder = {}
        var textOutput = await textInput(message, null, 'Create remainder', 'What should it be named?', null)
        textOutput.inputMessage.delete()
        var name = textOutput.text

        // const rule = new global.schedule.RecurrenceRule()
        const rule: ScheaduledTime = { name, year: null, month: null, date: null, dayOfWeek: null, hour: null, minute: null, second: null, repeatable: null }
        textOutput = await textInput(message, textOutput.botMessage, 'Create remainder', 'Enter time text (year, month, day, hour:minute:second)\nJanuary is 0! etc.', null)
        textOutput.inputMessage.delete()
        var split = textOutput.text.split(' ')

        function procLast(i: number) {
            var splitLast = split[i].split(':')
            rule.hour = splitLast[0]
            if (splitLast[0] === '*') {
                rule.hour = null
            }
            rule.minute = '0'
            rule.second = '0'
            if (splitLast.length > 1) {
                rule.minute = splitLast[1]
                if (splitLast[1] === '*') {
                    rule.minute = null
                }
            }
            if (splitLast.length > 2) {
                rule.second = splitLast[2]
                if (splitLast[2] === '*') {
                    rule.second = null
                }
            }
        }

        function procDay(i: number) {
            var lastSplit = split[i].split('.')
            if (lastSplit.length === 1) {
                //jen den
                rule.date = lastSplit[i]
            }
            else {
                if (!lastSplit[0]) {
                    //.3
                    rule.dayOfWeek = lastSplit[1]
                }
                else {
                    //10.3
                    rule.date = lastSplit[0]
                    rule.month = (parseInt(lastSplit[1]) - 1).toString()
                }
            }
        }
        function procYear(i: number) {
            rule.year = split[i]
        }

        if (split.length === 1) {
            procLast(0)
        }
        else if (split.length === 2) {
            procDay(0)
            procLast(1)
        }
        else if (split.length === 3) {
            procYear(0)
            procDay(1)
            procLast(2)
        }
        console.log(rule)

        //TODO: zobrazit - mesic je od 0 !!!! -> motth+1 pri zobrazei
        var output = await reactionForm(message, textOutput.botMessage, 'Create remainder', 'Should it be repeatable?', YES_NO)
        rule.repeatable = output.id === 0 ? true : false
        var sec = Math.floor((timeToDate(rule).getTime() - Date.now()) / 1000)
        var hours = Math.floor(sec / 3600); // get hours
        var minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
        var seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
        var output = await reactionForm(message, textOutput.botMessage, 'Create remainder', 'Is this okey?\n' + `${hours}:${minutes}:${seconds}\n` + JSON.stringify(rule, null, 2), YES_NO)
        var server = global.servers["275625726810652673"]
        if (output.id === 0) {
            try {
                server.scheaduledTimes.push(rule)
            }
            catch {
                server.scheaduledTimes = []
                server.scheaduledTimes.push(rule)

            }
            global.serverManager("275625726810652673", true)
        }


        if (output.botMessage.deletable) {
            output.botMessage.delete()
        }



    },
    permissions: [],
    requiredRoles: [],
    allowedIDs: ['255345748441432064'],
}