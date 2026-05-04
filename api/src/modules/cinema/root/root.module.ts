import { Module } from '@nestjs/common';
import { FootageModule } from '../footage/footage.module.js';
import { RoomModule } from '../room/room.module.js';
import { SeatsModule } from '../seats/seats.module.js';
import { ShowtimesModule } from '../showtimes/showtimes.module.js';
@Module({
  imports: [FootageModule, RoomModule, SeatsModule, ShowtimesModule],
})
export class CinemaModule {}
