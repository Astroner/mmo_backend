import { Either, Left } from 'monet';

export const asyncChain = async <L, R, NextLeft, NextRight>(
  either: Either<L, R>,
  mapper: (val: R) => Promise<Either<NextLeft | L, NextRight>>
): Promise<Either<NextLeft | L, NextRight>> => {
  const res = either.map(mapper);
  if (res.isRight()) {
    return await res.right();
  }
  return Left(either.left());
};
