import { Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";
import language, { languageI } from "../../language";

type Beer = "branik" | "radegast";
type Unit = "sixpack" | "petka" | "basa" | "flaska";
type PivoTranslation =
    | "PIVO_REPLY"
    | "PIVO_INVALID_AMOUNT"
    | "PIVO_UNIT_SIXPACK"
    | "PIVO_UNIT_PETKA"
    | "PIVO_UNIT_BASA"
    | "PIVO_UNIT_FLASKA"
    | "PIVO_BEER_BRANIK"
    | "PIVO_BEER_RADEGAST";

const prices = {
    branik: {
        single: 40,
        package: 240,
    },
    radegast: {
        single: 20,
        package: 400,
    },
} as const;

const normalizeBeer = (value: string): Beer | null => {
    const normalized = value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    if (normalized === "branik") return "branik";
    if (normalized === "radegast" || normalized === "radagast") return "radegast";
    return null;
};

const parseAmount = (value: string): number | null => {
    const normalized = value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
    const match = normalized.match(/^(\d+)\s*(k|stovek|stovky|stovka|kilo|litr|litru|litry)?$/);
    if (!match) return null;

    const baseAmount = Number(match[1]);
    const unit = match[2];
    const multiplier = unit === "k" || unit === "litr" || unit === "litru" || unit === "litry"
        ? 1000
        : unit === "stovek" || unit === "stovky" || unit === "stovka" || unit === "kilo"
            ? 100
            : 1;
    const amount = baseAmount * multiplier;

    return Number.isSafeInteger(amount) ? amount : null;
};

const declineUnit = (count: number, unit: Unit, translate: (key: PivoTranslation) => string): string => {
    const keys: Record<Unit, PivoTranslation> = {
        sixpack: "PIVO_UNIT_SIXPACK",
        petka: "PIVO_UNIT_PETKA",
        basa: "PIVO_UNIT_BASA",
        flaska: "PIVO_UNIT_FLASKA",
    };
    const forms = translate(keys[unit]).split("|");

    if (count === 1) return forms[0];
    if (count >= 2 && count <= 4) return forms[1];
    return forms[2];
};

const createReply = (amount: number, beer: Beer, translate: (key: PivoTranslation) => string): string => {
    const usePackage = amount >= prices[beer].package;
    const price = usePackage ? prices[beer].package : prices[beer].single;
    const count = Math.floor(amount / price);
    const unit: Unit = beer === "branik"
        ? (usePackage ? "sixpack" : "petka")
        : (usePackage ? "basa" : "flaska");
    const beerName = translate(beer === "branik" ? "PIVO_BEER_BRANIK" : "PIVO_BEER_RADEGAST");

    return translate("PIVO_REPLY")
        .replace("{count}", count.toString())
        .replace("{unit}", declineUnit(count, unit, translate))
        .replace("{beer}", beerName);
};

export default {
    commands: ["pivo"],
    expectedArgs: "<částka> [braník|radegast] (např. 600, 6k, 6 kilo, 6 litrů)",
    minArgs: 1,
    maxArgs: 3,
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    isCommand: true,
    data: new SlashCommandBuilder()
        .addStringOption(option => option
            .setName("amount")
            .setNameLocalizations({ "cs": "částka" })
            .setDescription("Amount in Czech crowns, e.g. 600, 6k, 6 kilo, or 6 litrů")
            .setDescriptionLocalizations({ "cs": "Částka v korunách, např. 600, 6k, 6 kilo nebo 6 litrů" })
            .setRequired(true))
        .addStringOption(option => option
            .setName("beer")
            .setNameLocalizations({ "cs": "pivo" })
            .setDescription("Choose Braník or Radegast")
            .setDescriptionLocalizations({ "cs": "Vyber Braník nebo Radegast" })
            .addChoices(
                { name: "Braník", value: "branik" },
                { name: "Radegast", value: "radegast" },
            )
            .setRequired(false)),
    callback: async (message: Message, args: string[]) => {
        const requestedBeer = normalizeBeer(args[args.length - 1]);
        const beer = requestedBeer ?? "radegast";
        const amountParts = requestedBeer ? args.slice(0, -1) : args;
        const amount = parseAmount(amountParts.join(" "));

        if (amount === null) {
            await message.reply(language(message, "PIVO_INVALID_AMOUNT"));
            return;
        }

        await message.reply(createReply(amount, beer, key => language(message, key)));
    },
    execute: async (interaction) => {
        const amount = parseAmount(interaction.options.getString("amount", true));
        const beerOption = interaction.options.getString("beer");
        const beer = beerOption ? normalizeBeer(beerOption) ?? "radegast" : "radegast";

        if (amount === null) {
            await interaction.reply(languageI(interaction, "PIVO_INVALID_AMOUNT"));
            return;
        }

        await interaction.reply(createReply(amount, beer, key => languageI(interaction, key)));
    },
} as CommandOptions;
