# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run

```bash
npm start          # tsc compile + run (./dist/index.js)
npx tsc            # compile only, output to ./dist/
node .             # run already-compiled dist
```

There are no tests. Deploy slash commands to Discord:

```bash
npx ts-node src/deployCommands.ts   # registers slash commands with Discord API
```

Requires a `.env` file with `DJS_TOKEN`, `CLIENT_ID`, `LOGGING_CHANNEL`, and optionally `LOGGING_CHANNEL_RAW`, `STATUS`.

## Architecture

### Entry point: `src/index.ts`
Bootstraps the Discord client, loads all commands (both legacy prefix and slash), and attaches all event listeners (`clientReady`, `interactionCreate`, `voiceStateUpdate`, `messageCreate`, `messageReactionAdd`, `messageReactionRemove`).

### Dual command system
Every command supports both legacy prefix commands and slash commands:

- **Legacy (prefix)**: `command-base.ts` scans `src/commands/**` at startup and registers a `messageCreate` listener per command file. Triggered by `_<commandname>`.
- **Slash**: `readAllCommands.ts` auto-discovers command files, sets their `.name` and `.description` from `languageDATA.ts` translations, and registers them in `global.slashCommands`. Dispatched in `interactionCreate`.

Each command file exports a `CommandOptions` object with both `callback` (legacy) and `execute` (slash). `isCommand: true` marks it as a leaf command; `isCommand: false` marks it as a subcommand container (its subfolder contains the actual subcommands, e.g. `cekarna/`).

### Translations (`src/languageDATA.ts`)
All user-facing strings are keyed by ID (e.g. `WF_ERR_DICT`). Every command file's short/long description must have a corresponding `DES_<FILENAME>_SHORT` and `DES_<FILENAME>_LONG` entry. Missing keys cause console errors at startup. Use `language(message, key)` in callbacks and `languageI(interaction, key)` in execute handlers.

### Persistent state
`src/database.ts` initialises a `better-sqlite3` database (`./servers.db`) with tables for:
- `servers` — per-guild config (language, prefix, cekarnaChannel, etc.)
- `word_football_state` — active game state per guild+channel
- `dictionary` — valid words for slovní fotbal
- `user_wf_stats` — per-user word football statistics
- `voice_logs` — voice channel join/leave audit log

`src/server-manager.ts` keeps an in-memory cache (`global.servers`) synced with the DB. Call `serverManager(guildId)` to load and `serverManager(guildId, true)` to persist.

### Word Football (`src/utils/wordFootball.ts`)
Core game logic called from the single `messageCreate` listener. Validates words against the `dictionary` table, enforces turn order, handles Czech/Slovak vowel groups (á↔a, etc.) at word boundaries, tracks used words per game, reacts with ✅/❌, and times out rule-breakers. Exports `handleWFReaction` for the ⭐-reaction-to-dictionary feature. All responses are Discord embeds.

Constant `STARS_TO_ADD_WORD = 10` controls how many ⭐ reactions a message needs before its word is added to the global dictionary.

### Event registry (`src/events/registry.ts`)
Exports four typed arrays: `messageHandlers`, `reactionAddHandlers`, `reactionRemoveHandlers`, `voiceStateHandlers`. There is exactly **one** `bot.on(event, ...)` call per event type in `index.ts`, which iterates the relevant array. New event handlers should be pushed into these arrays rather than calling `bot.on` directly.

- Command handlers are pushed by `command-base.ts` (during `clientReady`).
- WF and server-hook handlers are pushed at module load time in `index.ts`.

### Server-specific hooks (`src/server-hooks/`)
`index.ts` exports `registerServerMessageHook(guildId, hook)` and `runServerMessageHooks(message)`. Add per-server behaviors in `hooks.ts` by calling `registerServerMessageHook` with the guild ID and an async handler. The handler receives every non-bot message from that guild. Use this for one-off server rules (e.g. auto-delete embeds from a specific user).

### Adding a new command
1. Create `src/commands/<category>/<name>.ts` exporting a `CommandOptions` default.
2. Add `DES_<NAME>_SHORT` and `DES_<NAME>_LONG` keys to `languageDATA.ts` for all languages.
3. Run `npm start` — the command auto-registers at startup. Run `deployCommands.ts` to push slash commands to Discord.
