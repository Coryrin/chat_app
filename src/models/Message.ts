import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IChatGroup } from './ChatGroup';

export interface IMessage extends Document {
    content: string;
    author: IUser;
    chatGroup: IChatGroup;
    createdDate: Date;
}

const messageSchema = new Schema<IMessage>({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    chatGroup: {
        type: Schema.Types.ObjectId,
        ref: 'ChatGroup',
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    }
});

export const Message = mongoose.model<IMessage>('Message', messageSchema);
