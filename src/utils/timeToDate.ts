import { ScheaduledTime } from "../types";

export default (time: ScheaduledTime): Date => {
    var date = new Date()
    if (time.year) {
        date.setFullYear(parseInt(time.year))
    }
    if (time.month) {
        date.setMonth(parseInt(time.month))
    }
    if (time.date) {
        date.setMonth(parseInt(time.date))
    }
    if (time.hour) {
        date.setHours(parseInt(time.hour))
    }
    if (time.minute) {
        date.setMinutes(parseInt(time.minute))
    }
    if (time.second) {
        date.setSeconds(parseInt(time.second))
    }

    return date
}