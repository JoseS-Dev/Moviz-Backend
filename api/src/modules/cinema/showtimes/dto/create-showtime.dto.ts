import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsEnum,
    IsDate,
    IsNumber,
    IsBoolean
} from 'class-validator';
import { Transform } from 'class-transformer';
import { 
    StatusShowtime,
    LanguageType 
} from '../../../../../generated/prisma/enums.js'
export class CreateShowtimeDto {
    @IsNumber()
    @IsNotEmpty()
    movie_id!: number;

    @IsNumber()
    @IsNotEmpty()
    room_id!: number;

    @Transform(({value}) => new Date(value))
    @IsDate()
    @IsNotEmpty()
    start_time!: Date;

    @Transform(({value}) => new Date(value))
    @IsDate()
    @IsNotEmpty()
    end_time!: Date;

    @IsNumber()
    @IsNotEmpty()
    price_showtime!: number;

    @IsEnum(StatusShowtime)
    @IsString()
    @IsNotEmpty()
    status_showtime!: StatusShowtime;

    @IsEnum(LanguageType)
    @IsString()
    @IsOptional()
    language_type?: LanguageType

    @IsBoolean()
    @IsOptional()
    is_pre_release?: boolean;

}
