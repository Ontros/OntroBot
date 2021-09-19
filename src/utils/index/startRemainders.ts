import { TextChannel } from "discord.js";
import { ScheaduledTimes } from "../../types";
import timeToDate from "../timeToDate";
export const remaindersInit = async () => {
    //NOTE: restart znamena ze se zpetne netrigernou 
    const rule = new global.schedule.RecurrenceRule();
    var dates: Date[] = []
    global.serverManager("275625726810652673")
    if (global.servers["275625726810652673"].scheaduledTimes) {
        for (var [i, time] of global.servers["275625726810652673"].scheaduledTimes.entries()) {
            dates[i] = timeToDate(time)
        }
    }
    rule.second = 20;
    var server = await global.bot.guilds.fetch("275625726810652673")
    //@ts-expect-error
    var channel: TextChannel = await server.channels.cache.get("879519415102738502")
    if (!channel) {
        console.log("no remainder channel")
        return
    }
    //var channel: TextChannel = await global.bot.channels.fetch("879503697233707008")
    global.schedule.scheduleJob("Remainders", rule, () => {

        if (global.servers["275625726810652673"].scheaduledTimes) {
            for (var [i, time] of global.servers["275625726810652673"].scheaduledTimes.entries()) {
                console.log(server.channels.cache.array())
                //var sec = Math.floor((timeToDate(time).getTime() - Date.now()) / 1000)
                var sec = Math.floor((dates[i].getTime() - Date.now()) / 1000)
                if (sec <= 0) {
                    if (!channel) {
                        console.log("no remainder channel")
                        return
                    }
                    channel.send(`${time.name}`)
                    if (!time.repeatable) {
                        global.servers["275625726810652673"].scheaduledTimes =
                            global.servers["275625726810652673"].scheaduledTimes.filter((value, index) => { return index !== i });
                        global.serverManager("275625726810652673", true)
                    }
                }
            }
        }
    })
}