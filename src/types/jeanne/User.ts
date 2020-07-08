import { Document } from "mongoose";

interface IUser {
    uid: string;
    level: number;
    points: number;
    about: string;
    blacklisted: boolean;
    donator: boolean;
    background: string;
}

interface IUserModel extends IUser, Document {}

export default IUserModel;
