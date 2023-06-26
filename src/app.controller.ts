import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { IUserData } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AppService) { }

  @Post('login')
  @HttpCode(200)
  async loginController(@Body() body: IUserData): Promise<any> {
    const result = await this.appService.loginService(body);
    return result;
  }
  @Post('register')
  @HttpCode(201)
  async registerController(@Body() body: IUserData): Promise<any> {
    const result = await this.appService.registerService(body);
    return result;
  }
}
