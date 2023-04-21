import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IChatGroup extends Document {
    name: string;
    members: IUser['_id'][];
}

const chatGroupSchema = new Schema<IChatGroup>({
    name: {
        type: String,
        required: true,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]
});

interface IMembers extends Document {
    user: IUser['_id'],
    chatGroup: IChatGroup['_id'],
}

const membersSchema = new Schema<IMembers>({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
    },
    chatGroup: {
        type: Schema.Types.ObjectId,
        ref: 'ChatGroup',
        required: true,
    }
});

export const ChatGroup = mongoose.model<IChatGroup>('ChatGroup', chatGroupSchema);
export const Members = mongoose.model<IMembers>('Members', membersSchema);
