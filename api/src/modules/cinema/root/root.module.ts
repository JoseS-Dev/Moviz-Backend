import { Module } from "@nestjs/common";
import { FootageModule } from "../footage/footage.module.js";
import { RoomModule } from "../room/room.module.js";

@Module({
    imports: [
        FootageModule,
        RoomModule
    ]
})
export class CinemaModule {}