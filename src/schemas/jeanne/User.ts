import UserModel from "~/types/jeanne/User";
import { Schema } from "mongoose";

const User: Schema<UserModel> = new Schema<UserModel>({
    id: String,
    level: Number,
    points: Number,
    about: String,
    blacklisted: Boolean,
    donator: Boolean,
    background: String
});

export default User;
