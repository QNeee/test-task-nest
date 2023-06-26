import { Injectable, NotAcceptableException, NotFoundException, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { IUserData } from './types';
import User from './database/userModel';
import { connectMongo } from './database/connection';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
  ) { }

  async init(): Promise<void> {
    const isFirstRun = await this.redisClient.get('isFirstRun');
    if (!isFirstRun) {
      const connection = await connectMongo();
      const count = await User.countDocuments();
      if (count === 0) {
        const newUser = {
          email: "dcasdad@gmail.com",
          password: 'qwer1234'
        };
        const savedUser = new User(newUser);
        await savedUser.save();
        await connection.disconnect();
        await this.generateRedisData();
        await this.loginService(newUser);
      }
      await this.redisClient.set('isFirstRun', 'true');
    }
  }

  async loginService(body: IUserData): Promise<IUserData | any[]> {
    const { email, password } = body;
    if (!email || !password) throw new NotFoundException('Email and password are required');
    const connection = await connectMongo();
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundException('user not found');
    if (!await bcrypt.compare(password, user.password)) {
      throw new NotFoundException("Email or password is wrong");
    }
    const token = jwt.sign({
      _id: user._id,
    }, process.env.JWT_SECRET);
    await User.findOneAndUpdate({ email }, { token: token });
    connection.disconnect();
    // const response = {
    //   id: user._id,
    //   email: user.email,
    //   token
    // }
    const response = await this.getRedisData();
    return response;
  }

  async registerService(body: IUserData): Promise<IUserData> {
    const { email, password } = body;
    if (!email || !password) throw new NotFoundException('Email and password are required');
    const connection = await connectMongo();
    const user = await User.findOne({ email });
    if (user) throw new NotAcceptableException('Email already in use');
    const newUser = {
      email,
      password,
    };
    const createdUser = new User(newUser);
    await createdUser.save();
    connection.disconnect();
    return newUser;
  }

  private async generateRedisData(): Promise<void> {
    const length = 10;
    for (let i = 0; i < length; i++) {
      const key = `data:${i}`;
      const value = `value:${i}`;
      await this.redisClient.set(key, value);
    }
  }

  async clearRedisDatabase() {
    await this.redisClient.flushdb();
    console.log('Redis database cleared.');
    await this.redisClient.quit();
  }

  async getRedisData(): Promise<any[]> {
    const keys = await this.redisClient.keys('data:*');
    const values = await this.redisClient.mget(...keys);
    const data = keys.map((key, index) => ({
      key,
      value: values[index],
    }));
    console.log(data);
    return data;
  }
}