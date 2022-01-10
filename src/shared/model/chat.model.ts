import type * as mongoose from 'mongoose';
export interface Chat {
    _id?:{type: mongoose.Types.ObjectId}
    sender: string,
    to?: string,
    text: string,
}