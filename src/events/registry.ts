import { Message, MessageReaction, PartialMessageReaction, PartialUser, User, VoiceState } from 'discord.js';

export type MessageHandler = (message: Message) => Promise<void>;
export type ReactionAddHandler = (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => Promise<void>;
export type ReactionRemoveHandler = (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => Promise<void>;
export type VoiceStateHandler = (oldState: VoiceState, newState: VoiceState) => Promise<void>;

export const messageHandlers: MessageHandler[] = [];
export const reactionAddHandlers: ReactionAddHandler[] = [];
export const reactionRemoveHandlers: ReactionRemoveHandler[] = [];
export const voiceStateHandlers: VoiceStateHandler[] = [];
