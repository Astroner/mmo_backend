import { AuthModule } from '@/auth/auth.module';
import { DatabaseModule } from '@/database/database.module';
import { GameModule } from '@/game/game.module';
import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';

@Module({
  providers: [SocketGateway],
  imports: [AuthModule, DatabaseModule, GameModule],
})
export class SocketModule {}
