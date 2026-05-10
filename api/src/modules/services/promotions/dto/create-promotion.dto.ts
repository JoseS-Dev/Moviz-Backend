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
import { TypePromotion } from '../../../../../generated/prisma/enums.js';
export class CreatePromotionDto {
    @IsString()
    @IsNotEmpty()
    code_promotion!: string;

    @IsString()
    @IsNotEmpty()
    name_promotion!: string;

    @IsOptional()
    @IsString()
    description_promotion?: string;

    @IsNotEmpty()
    @IsNumber()
    discount_value!: number;

    @IsNotEmpty()
    @IsEnum(TypePromotion)
    type_promotion!: TypePromotion;

    @Transform(({ value }) => new Date(value))
    @IsNotEmpty()
    @IsDate()
    start_date!: Date;

    @Transform(({ value }) => new Date(value))
    @IsOptional()
    @IsDate()
    end_date?: Date;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}
