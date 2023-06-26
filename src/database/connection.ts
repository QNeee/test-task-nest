import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
mongoose.set('strictQuery', false);

export const connectMongo = async (): Promise<typeof mongoose> => {
    return mongoose.connect(process.env.Mongo_URL);
};