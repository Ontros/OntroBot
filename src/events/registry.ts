import { Message, MessageReaction, OmitPartialGroupDMChannel, PartialMessage, PartialMessageReaction, PartialUser, User, VoiceState } from 'discord.js';

export type MessageHandler = (message: Message) => Promise<void>;
export type MessageDeleteHandler = (message: OmitPartialGroupDMChannel<Message<boolean> | PartialMessage<boolean>>) => Promise<void>;
export type MessageUpdateHandler = (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) => Promise<void>;
export type ReactionAddHandler = (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => Promise<void>;
export type ReactionRemoveHandler = (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => Promise<void>;
export type VoiceStateHandler = (oldState: VoiceState, newState: VoiceState) => Promise<void>;

export const messageHandlers: MessageHandler[] = [];
export const messageDeleteHandlers: MessageDeleteHandler[] = [];
export const messageUpdateHandlers: MessageUpdateHandler[] = [];
export const reactionAddHandlers: ReactionAddHandler[] = [];
export const reactionRemoveHandlers: ReactionRemoveHandler[] = [];
export const voiceStateHandlers: VoiceStateHandler[] = [];
