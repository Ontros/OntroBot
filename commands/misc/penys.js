module.exports = {
    commands: ['penys', 'pp'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message, arguments, text) => {
        if (message.author.username.toLowerCase().includes("ontro"))
        {
            message.reply("Velikost tvojeho penysu je: 420 cm");
        }
        else if (message.author.username.toLowerCase().includes("tyfonek")) 
        {
            message.reply("Velikost tvojeho penysu je: "+(Math.random()*-10).toString() + " cm");
        }
        else
        {
            message.reply("Velikost tvojeho penysu je: " + (Math.random()*5).toString() + " cm");
        }
    }
}