import { Module } from '@nestjs/common';
import { FootageModule } from '../footage/footage.module.js';
import { RoomModule } from '../room/room.module.js';
import { SeatsModule } from '../seats/seats.module.js';
import { ShowtimesModule } from '../showtimes/showtimes.module.js';
import { ReservationModule } from '../reservation/reservation.module.js';

@Module({
  imports: [
    FootageModule, 
    RoomModule, 
    SeatsModule, 
    ShowtimesModule,
    ReservationModule
  ],
})
export class CinemaModule {}
