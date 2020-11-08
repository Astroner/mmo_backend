import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoUser, UserSchema } from './user/user.schema';
import { UserService } from './user/user.service';

@Module({
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([{ name: MongoUser.name, schema: UserSchema }]),
  ],
  exports: [UserService],
})
export class DatabaseModule {}
