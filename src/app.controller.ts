import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { UserService } from './database';

@Controller()
export class AppController {
  constructor(private readonly users: UserService) {}

  @Get()
  async sendApp() {
    const users = await this.users.getAll();
    if (users.isLeft()) {
      throw new InternalServerErrorException();
    }
    return users.right();
  }
}
