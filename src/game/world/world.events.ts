export class IntersectionAction {
  constructor(
    public data: {
      id: string;
      x: number;
      y: number;
    }[],
    public anchor: {
      id: string;
      x: number;
      y: number;
    }
  ) {}
}

export class OutOfIntersectionAction {
  constructor(
    public data: {
      id: string;
      x: number;
      y: number;
    }[],
    public removed: {
      id: string;
      x: number;
      y: number;
    }
  ) {}
}
