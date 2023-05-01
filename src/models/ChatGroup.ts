import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IMessage } from './Message';

export interface IChatGroup extends Document {
    name: string;
    members: IUser['_id'][];
    messages: IMessage['_id'][];
}

const chatGroupSchema = new Schema<IChatGroup>({
    name: {
        type: String,
        required: true,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message',
    }]
});

export const ChatGroup = mongoose.model<IChatGroup>('ChatGroup', chatGroupSchema);
