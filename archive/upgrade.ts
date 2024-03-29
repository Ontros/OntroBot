import { Message, Role } from "discord.js";
import { GetCur_role } from "../../types";

module.exports = {
    commands: ['upgrade', 'u'],
    expectedArgs: '<id|mention>',
    permissionError: '',
    minArgs: 1,
    maxArgs: 1,
    callback: async (message: Message, args: string[], text: string) => {
        //TODO: check if enabled

        if (!message.guild) { return }

        //Make sure ID is valid and get user:
        const user = await global.getUser(message, args[0]); if (!user) { message.channel.send(global.lang(message.guild.id, 'USR_ID_NOT')); return; }

        //Get server steps:
        const Steps = global.servers[message.guild.id].steps
        if (!Steps) { message.channel.send(global.lang(message.guild.id, 'STEPS_NOT')); console.log("steps error"); return }

        //Get highest available role for getting current role:
        const maxStep = message.guild.roles.cache.get(Steps[Steps.length - 1].id) //HIGHEST AVAILEBLE STEP
        if (!maxStep) { message.channel.send(global.lang(message.guild.id, 'ROLE_ID_NOT')); console.log("role error0"); return }

        //Get current step:
        const getCur_role: GetCur_role = require('./../../utils/getCurStep')
        const { curStep, roleIndex } = getCur_role(Steps, user)
        if (!curStep) { message.channel.send(global.lang(message.guild.id, 'ROLE_ID_NOT')); console.log("role error1"); return }

        //Make sure there is room to be upgraded:
        if (maxStep.position <= curStep.position) {
            message.channel.send(global.lang(message.guild.id, 'NO_SPACE_FOR_UPGRADE'));
            return
        }

        //Get new step (position in server hierarchy):
        const step = Steps[roleIndex + 1];
        if (!step) { message.channel.send(global.lang(message.guild.id, 'ROLE_ID_NOT')); console.log("role error4"); return }

        //Get next role:
        const nextRole = await message.guild.roles.fetch(step.id);
        if (!nextRole) { message.channel.send(global.lang(message.guild.id, 'ROLE_ID_NOT')); console.log("role error2"); return }

        //Add+Remove roles:
        try {
            user.roles.remove(curStep)
            user.roles.add(nextRole)
        }
        catch {
            message.channel.send(global.lang(message.guild.id, 'CHNG_ROLES_ERR'))
        }

        //TODO: send PM info
    },
    permissions: ["ADMINISTRATOR"],
    requiredRoles: [],
    allowedIDs: [],
}