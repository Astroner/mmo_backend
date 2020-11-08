import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserInterface } from './user.interface';

@Schema()
export class MongoUser extends Document implements UserInterface {
  id: string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true, unique: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(MongoUser);
