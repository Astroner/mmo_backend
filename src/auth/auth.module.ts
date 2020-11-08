import { DatabaseModule } from '@/database/database.module';
import { env } from '@/env';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [AuthService, JwtStrategy],
  imports: [
    PassportModule,
    DatabaseModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: {
        expiresIn: '60m',
      },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
