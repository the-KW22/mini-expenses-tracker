import { Schema, model, models } from "mongoose";
import { IUser } from "@/types";

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minLength: [2, 'Name must be at least 2 characters'],
            maxLength: [50, 'Name must not exceed 50 characters'],
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email',]
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: [6, "Password must be at least 6 characters"],
        },

        image: {
            type: String,
            default: null,
        },

        theme: {
            type: String,
            enum: ['sage', 'rose', 'lavender', 'mint', 'peach', 'lemon'],
            default: 'sage',
        },
    },

    {
        timestamps: true,
    }
);

const User = models.User || model<IUser>('User', UserSchema);
export default User;