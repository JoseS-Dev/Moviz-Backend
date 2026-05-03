import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsEnum,
    IsBoolean,
    IsNumber
} from 'class-validator';
import {TypeSeat} from '../../../../../generated/prisma/enums.js';

export class CreateSeatDto {
    @IsNumber()
    @IsNotEmpty()
    room_id!: number;

    @IsString()
    @IsNotEmpty()
    row_number!: string;

    @IsNumber()
    @IsNotEmpty()
    seat_number!: number;

    @IsEnum(TypeSeat)
    @IsString()
    @IsNotEmpty()
    type_seat!: TypeSeat;

    @IsBoolean()
    @IsOptional()
    is_available?: boolean;

    @IsBoolean()
    @IsOptional()
    is_accessible?: boolean;
}
