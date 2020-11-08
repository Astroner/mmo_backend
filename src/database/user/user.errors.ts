export class NonUniqueError extends Error {
  constructor(public fieldName: string, public value: string) {
    super(`Field ${fieldName} must be unique "${value}" already exists`);
  }
}

export class NotFound extends Error {}

export class MongoError extends Error {}
