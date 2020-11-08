import { Injectable, OnModuleInit } from '@nestjs/common';
import WebSocket from 'ws';
import {
  IntersectionAction,
  OutOfIntersectionAction,
} from '../world/world.events';
import { WorldService } from '../world/world.service';

@Injectable()
export class PlayersService implements OnModuleInit {
  private players = new Map<
    string,
    {
      id: string;
      ws: WebSocket;
      username: string;
    }
  >();

  constructor(private world: WorldService) {}

  onModuleInit() {
    this.world.events.subscribe(action => {
      if (action instanceof IntersectionAction) {
        const center = this.players.get(action.anchor.id);
        if (center && action.data.length) {
          center.ws.send(
            JSON.stringify({
              type: 'addToView',
              data: action.data,
            })
          );
        }

        for (const item of action.data) {
          if (!this.players.has(item.id)) continue;
          const player = this.players.get(item.id);
          const toSend = action.data
            .filter(item => item.id !== player.id)
            .concat(action.anchor);
          if (toSend.length)
            player.ws.send(
              JSON.stringify({
                type: 'addToView',
                data: action.data
                  .filter(item => item.id !== player.id)
                  .concat(action.anchor),
              })
            );
        }
      } else if (action instanceof OutOfIntersectionAction) {
        for (const item of action.data) {
          if (!this.players.has(item.id)) continue;
          const player = this.players.get(item.id);
          player.ws.send(
            JSON.stringify({
              type: 'removeFromView',
              data: [action.removed],
            })
          );
        }
        if (this.players.has(action.removed.id) && action.data.length) {
          this.players.get(action.removed.id).ws.send(
            JSON.stringify({
              type: 'removeFromView',
              data: action.data,
            })
          );
        }
      }
    });
  }

  private moveMap = {
    up: { x: 0, y: 10 },
    left: { x: -10, y: 0 },
    down: { x: 0, y: -10 },
    right: { x: 10, y: 0 },
  };

  addPlayer(id: string, username: string, ws: WebSocket): void {
    const other = Array.from(this.players.values());
    ws.send(
      JSON.stringify({
        type: 'init',
        data: {
          x: 0,
          y: 0,
          other: other.map(item => ({
            username: item.username,
            id: item.id,
          })),
        },
      })
    );
    this.players.set(id, { id, username, ws });
    this.world.addObject(id, 0, 0);
  }

  action(id: string, type: 'move', direction: keyof PlayersService['moveMap']) {
    if (!this.players.has(id)) return;
    const data = this.world.shiftObject(
      id,
      this.moveMap[direction].x,
      this.moveMap[direction].y
    );
    return {
      type: 'move',
      data,
    };
  }

  removePlayer(id: string): void {
    this.world.removeObject(id);
    this.players.delete(id);
  }
}
