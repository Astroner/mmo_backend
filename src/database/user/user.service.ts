import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Either, Left, Right } from 'monet';
import { Model, Error } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { PublicProfile } from './user.interface';
import { MongoUser } from './user.schema';
import { NonUniqueError, NotFound, MongoError } from './user.errors';
import { transformEntity } from './helpers';

@Injectable()
export class UserService {
  constructor(@InjectModel(MongoUser.name) private user: Model<MongoUser>) {}

  async getAll(): Promise<Either<MongoError, PublicProfile[]>> {
    try {
      const res = await this.user.find();
      return Right(res.map(transformEntity));
    } catch (e) {
      return Left(new MongoError());
    }
  }

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
      return Right(transformEntity(result));
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
      if (!result || !(await bcrypt.compare(result.password, password))) {
        return Left(new NotFound());
      }

      return Right(transformEntity(result));
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
      return Right(transformEntity(result));
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
