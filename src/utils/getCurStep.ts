module.exports = (steps: Step[], user: Member) => {
    for (var i = steps.length-1; i>=0; i--) {
        var step: Role = user.roles.cache.get(steps[i].id)
        if (step) {
            return {curStep: step,roleIndex: i}
        }
    }
    return null
}