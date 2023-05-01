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
        max: 55,
        unique: true
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

export const generateHash = async (password: string): Promise<string | undefined> => {
    try {
        const salt = await bcrypt.genSalt(HASH_WORK_FACTOR);
        return await bcrypt.hash(password, salt);
    } catch(err) {
        console.error(`Error generating hash: ${err}`)
    }
}

userSchema.pre<IUser>('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }

        const hash = await generateHash(this.password);

        if (hash) {
            this.password = hash;
        }

        next();
    } catch (error) {
        console.log('error:', error);
        next();
    }
});

export const User = model('User', userSchema);
