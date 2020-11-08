export class ObjectNotFound extends Error {
  constructor(public requiredId: string) {
    super();
  }
}
