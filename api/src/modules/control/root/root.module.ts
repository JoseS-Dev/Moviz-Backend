import { Module, Session } from "@nestjs/common";
import { SessionModule } from "../session/session.module.js";
import { UsersModule } from "../users/users.module.js";
import { FavoritesModule } from "../favorites/favorites.module.js";

@Module({
    imports: [
        SessionModule,
        UsersModule,
        FavoritesModule
    ],
})

export class ControlModule {}