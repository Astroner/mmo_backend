import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AuthModule } from '@/auth/auth.module';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [UserController],
})
export class UserModule {}
