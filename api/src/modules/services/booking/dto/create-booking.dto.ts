import {
    IsString,
    IsOptional,
    IsNotEmpty,
    IsNumber,
    IsEnum
} from 'class-validator';
import { Transform } from 'class-transformer';
import { StatusBooking } from '../../../../../generated/prisma/enums.js';

export class CreateBookingDto {
    @IsNumber()
    @IsNotEmpty()
    user_id!: number;

    @IsNumber()
    @IsNotEmpty()
    showtime_id!: number;

    @IsNumber()
    @IsOptional()
    staff_id?: number;

    @IsNumber()
    @IsNotEmpty()
    total_price!: number;

    @IsString()
    @IsOptional()
    payment_method?: string;

    @IsEnum(StatusBooking)
    @IsString()
    status_booking!: StatusBooking;

    @IsString()
    @IsOptional()
    reason_cancellation?: string;
}
