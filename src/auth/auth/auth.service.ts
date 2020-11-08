import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Either, Left, Right } from 'monet';
import { JWTError } from './auth.errors';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}
  sign(id: string): Either<JWTError, { token: string }> {
    try {
      const token = this.jwt.sign({ id });
      return Right({ token });
    } catch (e) {
      return Left(new JWTError());
    }
  }
  verify(token: string): Either<JWTError, { id: string }> {
    try {
      const { id } = this.jwt.verify<{ id: string }>(token);
      return Right({ id });
    } catch (e) {
      return Left(new JWTError());
    }
  }
}
