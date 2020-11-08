import { AuthService } from '@/auth/auth/auth.service';
import { JwtGuard } from '@/auth/jwt.guard';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { PublicProfile, MongoError, UserService } from '@/database';
import { CurrentUser } from '@/decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private user: UserService, private auth: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto): Promise<{ token: string }> {
    const user = await this.user.findUser(body.username, body.password);
    const token = user.chain(user => this.auth.sign(user.id));
    return token.cata(
      () => {
        throw new ForbiddenException();
      },
      v => v
    );
  }

  @Post('register')
  @HttpCode(200)
  async register(@Body() body: LoginDto): Promise<PublicProfile> {
    const user = await this.user.createUser(body.username, body.password);

    return user.cata(
      err => {
        if (err instanceof MongoError)
          throw new BadRequestException('User with this name already exists');

        throw new InternalServerErrorException();
      },
      v => v
    );
  }

  @Get('info')
  @UseGuards(JwtGuard)
  getData(@CurrentUser() user: PublicProfile): PublicProfile {
    return user;
  }
}
