import {
    IsString,
    IsNotEmpty,
    IsBoolean,
    IsEnum,
    IsOptional,
    IsNumber
} from 'class-validator';
import { TypeNotification } from '../../../../../generated/prisma/enums.js';
export class CreateNotificationDto {
    @IsNumber()
    @IsNotEmpty()
    user_id!: number;

    @IsString()
    @IsNotEmpty()
    title_notification!: string;

    @IsString()
    @IsNotEmpty()
    message_notification!: string;

    @IsEnum(TypeNotification)
    @IsString()
    @IsNotEmpty()
    type_notification!: TypeNotification;

    @IsBoolean()
    @IsOptional()
    is_read?: boolean;
}
