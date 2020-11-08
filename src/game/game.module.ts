import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';
import { PlayersService } from './players/players.service';
import { WorldService } from './world/world.service';

@Module({
  imports: [DatabaseModule],
  providers: [PlayersService, WorldService],
  exports: [PlayersService],
})
export class GameModule {}
