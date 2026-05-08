import { Module } from "@nestjs/common";
import { PersonalModule } from "../personal/personal.module.js";

@Module({
    imports: [PersonalModule]
})
export class ERPModule {}