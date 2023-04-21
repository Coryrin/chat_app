import mongoose, { model, Document } from "mongoose";
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
}

const HASH_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
        max: 55
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        max: 55,
    }
});

userSchema.pre<IUser>('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }

        const salt = await bcrypt.genSalt(HASH_WORK_FACTOR);
        const hash = await bcrypt.hash(this.password, salt);

        this.password = hash;

        next();
    } catch (error) {
        console.log('error:', error);
        next();
    }
});

export const User = model('User', userSchema);
