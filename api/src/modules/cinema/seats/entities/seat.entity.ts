import {TypeSeat} from '../../../../../generated/prisma/enums.js'

export class Seat {
    room_id!: number;
    row_number!: string;
    seat_number!: number;
    type_seat!: TypeSeat;
    is_available!: boolean;
    is_accessible!: boolean;
}
