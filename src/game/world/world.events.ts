interface Item {
  id: string;
  x: number;
  y: number;
}

export class IntersectionAction {
  constructor(public data: Item[], public anchor: Item) {}
}

export class OutOfIntersectionAction {
  constructor(public data: Item[], public removed: Item) {}
}

export class ChangePositionEvent {
  constructor(public subject: Item, public watchers: Item[]) {}
}
