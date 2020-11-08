import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

import { IntersectionAction, OutOfIntersectionAction } from './world.events';

const viewRange = 10;

export type Item = {
  id: string;
  x: number;
  y: number;
};

@Injectable()
export class WorldService {
  public events = new Subject<IntersectionAction | OutOfIntersectionAction>();

  private items = new Map<string, Item>();

  private xCords = new Map<number, string[]>();
  private yCords = new Map<number, string[]>();

  addObject(id: string, x: number, y: number) {
    const item = this.addItemToList({ id, x, y });

    const intersecting = this.getIntersections(item);

    this.events.next(new IntersectionAction(intersecting, item));
  }

  removeObject(id: string) {
    const item = this.items.get(id);
    if (!item) return;
    const intersections = this.getIntersections(item);
    this.events.next(new OutOfIntersectionAction(intersections, item));

    this.removeItemFromList(item);
  }

  getIntersections(subj: Item) {
    const intersecting: Item[] = [];

    for (let i = subj.x - viewRange; i <= subj.x + viewRange; i++) {
      if (!this.xCords.has(i)) continue;
      const row = this.xCords.get(i);
      for (const item of row) {
        if (item === subj.id) continue;
        const obj = this.items.get(item);
        if (
          Math.sqrt((obj.x - subj.x) ** 2 + (obj.y - subj.y) ** 2) <= viewRange
        ) {
          intersecting.push(obj);
        }
      }
    }

    return intersecting;
  }

  shiftObject(id: string, xShift: number, yShift: number) {
    const item = this.items.get(id);
    if (!item) return;
    const curIntersections = this.getIntersections(item);
    const nextIntersections = this.getIntersections({
      id: item.id,
      x: item.x + xShift,
      y: item.y + yShift,
    });

    const toRemove = curIntersections.filter(
      id => !nextIntersections.includes(id)
    );
    const toAdd = nextIntersections.filter(
      id => !curIntersections.includes(id)
    );
    this.events.next(new OutOfIntersectionAction(toRemove, item));
    this.events.next(new IntersectionAction(toAdd, item));

    this.removeItemFromList(item);

    item.x = item.x + xShift;
    item.y = item.y + yShift;

    this.addItemToList(item);

    return item;
  }

  private removeItemFromList(item: Item) {
    this.items.delete(item.id);

    const arrX = this.xCords.get(item.x);
    arrX.splice(arrX.indexOf(item.id), 1);
    const arrY = this.yCords.get(item.y);
    arrY.splice(arrY.indexOf(item.id), 1);
  }

  private addItemToList(item: Item) {
    this.items.set(item.id, item);

    if (!this.xCords.has(item.x)) this.xCords.set(item.x, []);
    if (!this.yCords.has(item.y)) this.yCords.set(item.y, []);

    this.xCords.get(item.x).push(item.id);
    this.yCords.get(item.y).push(item.id);

    return item;
  }
}
