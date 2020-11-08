import { AuthService } from '@/auth/auth/auth.service';
import { UserService } from '@/database';
import { PlayersService } from '@/game/players/players.service';
import { asyncChain } from '@/operators/asyncChain';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import WebSocket from 'ws';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private connections = new Map<WebSocket, string>();

  constructor(
    private auth: AuthService,
    private users: UserService,
    private players: PlayersService
  ) {}

  handleDisconnect(client: WebSocket): void {
    const id = this.connections.get(client);
    if (!id) return;
    this.players.removePlayer(id);
    this.connections.delete(client);
  }

  @SubscribeMessage('move')
  handleMessage(client: WebSocket, data: any): any {
    return this.players.action(this.connections.get(client), 'move', data);
  }

  async handleConnection(
    client: WebSocket,
    request: IncomingMessage
  ): Promise<void> {
    const search = new URL(request.url, `http://${request.headers.host}`)
      .searchParams;

    const token = search.get('token');
    const username = search.get('username');
    const password = search.get('password');

    const id = this.auth.verify(token);
    const user =
      username && password
        ? await this.users.findUser(username, password)
        : await asyncChain(id, ({ id }) => {
            return this.users.fundUserById(id);
          });

    if (user.isLeft()) {
      client.terminate();
      request.destroy();
      return;
    }
    const data = user.right();

    this.connections.set(client, data.id);

    this.players.addPlayer(data.id, data.username, client);

    return;
  }
}
