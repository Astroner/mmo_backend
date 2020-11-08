import { env } from '@/env';
import { UserService } from '@/database';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private user: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.headers.authorization,
      ]),
      secretOrKey: env.JWT_SECRET,
    });
  }
  async validate(data: { id: string }): Promise<any> {
    const user = await this.user.fundUserById(data.id);
    return user.cata(
      () => null,
      v => v
    );
  }
}
