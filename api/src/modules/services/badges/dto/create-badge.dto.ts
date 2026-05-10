import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
export class CreateBadgeDto {
    @IsString()
    @IsNotEmpty()
    name_badge!: string;

    @IsOptional()
    @IsString()
    description_badge?: string;

    @IsOptional()
    @IsString()
    icon_badge?: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}
