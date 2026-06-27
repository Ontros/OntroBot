# OntroBot
My personal discord bot  
If you want to use it create file called ".env" in the same directory as package.json with these variables:
```
DJS_TOKEN=(bot token)
CLIENT_ID=(bot application/client id, used to deploy slash commands)
LOGGING_CHANNEL=(channel id for voice join/leave logs)
LOGGING_CHANNEL_RAW=(optional: channel id for raw csv voice logs)
ERROR_CHANNEL=(optional: channel id where errors are reported)
STATUS=(optional: status under name)
```
And then do these commands (you must have Node.js installed):
```
npm install
tsc
node.ts
```
