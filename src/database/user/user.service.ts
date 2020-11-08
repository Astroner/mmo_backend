import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Either, Left, Right } from 'monet';
import { Model, Error } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { PublicProfile } from './user.interface';
import { MongoUser } from './user.schema';
import { NonUniqueError, NotFound, MongoError } from './user.errors';

@Injectable()
export class UserService {
  constructor(@InjectModel(MongoUser.name) private user: Model<MongoUser>) {}

  async createUser(
    username: string,
    password: string
  ): Promise<Either<NonUniqueError | MongoError, PublicProfile>> {
    const user = new this.user({
      username,
      password: await bcrypt.hash(password, 10),
    });

    try {
      const result = await user.save();
      return Right({
        id: result.id,
        username: result.username,
        x: result.x,
        y: result.y,
      });
    } catch (e) {
      if (e instanceof Error.ValidationError)
        return Left(new NonUniqueError('username', username));
      return Left(new MongoError());
    }
  }

  async findUser(
    username: string,
    password: string
  ): Promise<Either<NotFound, PublicProfile>> {
    try {
      const result = await this.user.findOne({
        username,
      });
      if (!result || !bcrypt.compare(result.password, password)) {
        return Left(new NotFound());
      }

      return Right({
        id: result.id,
        username: result.username,
        x: result.x,
        y: result.y,
      });
    } catch (e) {
      return Left(new NotFound());
    }
  }

  async fundUserById(
    id: string
  ): Promise<Either<NotFound | MongoError, PublicProfile>> {
    try {
      const result = await this.user.findById(id);
      if (!result) return Left(new NotFound());
      return Right({
        id: result.id,
        username: result.username,
        x: result.x,
        y: result.y,
      });
    } catch (e) {
      return Left(new MongoError());
    }
  }

  async updateUser(
    id: string,
    data: Partial<PublicProfile>
  ): Promise<Either<NotFound | MongoError, PublicProfile>> {
    try {
      const next = await this.user.updateOne({ _id: id }, data);
      return Right(next);
    } catch (e) {
      if (e instanceof Error.DocumentNotFoundError) {
        return Left(new NotFound());
      }
      return Left(new MongoError());
    }
  }
}
