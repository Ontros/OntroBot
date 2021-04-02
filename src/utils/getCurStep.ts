import { GuildMember, Role } from "discord.js"
import { Step } from "../types"

module.exports = (steps: Step[], user: GuildMember) => {
    for (var i = steps.length-1; i>=0; i--) {
        var step = user.roles.cache.get(steps[i].id)
        if (step) {
            return {curStep: step,roleIndex: i}
        }
    }
    return null
}