import { Module } from '@nestjs/common';
import Redis from 'ioredis';

@Module({
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: () => {
                return new Redis();
            },
        },
    ],
    exports: ['REDIS_CLIENT'],
})
export class DatabaseModule { }
