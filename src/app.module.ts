import { Module } from '@nestjs/common';
import { AuthController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AppService],
})
export class AppModule { }
