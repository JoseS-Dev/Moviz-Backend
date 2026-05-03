import {
    IsString, 
    IsNotEmpty, 
    IsOptional,

    IsNumber,
    IsDate,
    IsEnum,
    IsArray
} from 'class-validator'
import { Transform } from 'class-transformer'
import { typeFootage } from '../../../../../generated/prisma/enums.js';

export class CreateFootageDto {
    @IsString()
    @IsNotEmpty()
    title_footage!: string

    @IsString()
    @IsOptional()
    description_footage?: string;

    @IsEnum(typeFootage)
    @IsNotEmpty()
    type_footage!: typeFootage

    @IsNumber()
    @IsNotEmpty()
    duration!: number

    @IsString()
    @IsNotEmpty()
    genre_footage!: string;

    @IsNumber()
    @IsOptional()
    rating_footage?: number;

    @IsString()
    @IsOptional()
    poster_url?: string;

    @IsString()
    @IsOptional()
    backdrop_url?: string;

    @IsString()
    @IsOptional()
    trailer_url?: string;

    @Transform(({value}) => new Date(value))
    @IsDate()
    @IsOptional()
    realease_date?: Date

    @IsString()
    @IsNotEmpty()
    language_footage!: string;

    @IsString()
    @IsNotEmpty()
    director_footage!: string;

    @IsArray()
    @IsString({each: true})
    @IsNotEmpty()
    cast_footage!: string[]
}
