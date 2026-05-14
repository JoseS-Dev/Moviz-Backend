import { IsNumber , IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
export class CreateDiscountDto {
    @IsNumber()
    @IsNotEmpty()
    user_id!: number;

    @IsNumber()
    @IsNotEmpty()
    promotion_id!: number;

    @IsBoolean()
    @IsOptional()
    is_used!: boolean;
}
