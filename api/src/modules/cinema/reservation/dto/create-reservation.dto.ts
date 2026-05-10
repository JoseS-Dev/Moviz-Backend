import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
    @IsNumber()
    @IsNotEmpty()
    booking_id!: number;

    @IsNumber()
    @IsNotEmpty()
    seat_id!: number;
}
