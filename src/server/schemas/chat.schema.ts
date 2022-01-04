import mongoose from 'mongoose';
import type { Chat } from '../../shared/model/chat.model.js';
const {Schema, model} = mongoose

const chatSchema = new Schema<Chat>({
    sender: {type: String, required: true},
    to: {type: String},
    text: {type: String, required: true},
});

export const ChatModel = model<Chat>('Chat',chatSchema)