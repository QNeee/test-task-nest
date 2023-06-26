import { Types } from "mongoose";

export interface IUserData {
    id?: Types.ObjectId,
    email: string,
    password?: string
    token?: string
}