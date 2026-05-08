import {
    IsString,
    IsOptional,
    IsNotEmpty,
    IsBoolean,
    IsEnum
} from 'class-validator';
import {roleStaff} from '../../../../../generated/prisma/enums.js';
export class CreatePersonalDto {
    @IsString()
    @IsNotEmpty()
    name_staff!: string;

    @IsString()
    @IsNotEmpty()
    email_staff!: string;

    @IsString()
    @IsOptional()
    mobile_staff?: string;

    @IsString()
    @IsOptional()
    identification_number?: string;

    @IsEnum(roleStaff)
    @IsString()
    @IsNotEmpty()
    role_staff!: roleStaff;

    @IsBoolean()
    @IsOptional()
    is_active!: boolean;
}
