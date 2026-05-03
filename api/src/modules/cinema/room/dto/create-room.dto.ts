import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    IsEnum,
    IsDate,
    IsBoolean
} from 'class-validator'
import { Transform } from 'class-transformer'
import { TypeRoom } from '../../../../../generated/prisma/enums.js';

export class CreateRoomDto {
    @IsString()
    @IsNotEmpty()
    name_room!: string;

    @IsNumber()
    @IsNotEmpty()
    capacity_room!: number;

    @IsEnum(TypeRoom)
    @IsString()
    type_room!: TypeRoom

    @Transform(({value}) => new Date(value))
    @IsDate()
    @IsOptional()
    last_maintenance?: Date;

    @IsNumber()
    @IsOptional()
    cleaning_duration?: number;

    @IsString()
    @IsOptional()
    sound_system?: string;

    @IsString()
    @IsOptional()
    projector_type?: string;

    @IsBoolean()
    @IsOptional()
    has_wheelchair_access?: boolean
}
