import { TypeRoom } from "../../../../../generated/prisma/enums.js";

export class Room {
    name_room!: string;
    code_room!: string;
    capacity_room!: number;
    type_room!: TypeRoom;
    last_maintenance?: Date | null;
    cleaning_duration?: number | null;
    sound_system?: string | null;
    projector_type?: string | null;
    has_wheelchair_access?: boolean
}
