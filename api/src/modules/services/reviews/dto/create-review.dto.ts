import { IsNumber, IsNotEmpty, IsOptional, IsBoolean, IsString} from 'class-validator';
export class CreateReviewDto {
    @IsNumber()
    @IsNotEmpty()
    user_id!: number;

    @IsNumber()
    @IsNotEmpty()
    movie_id!: number;

    @IsNumber()
    @IsNotEmpty()
    rating_review!: number;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @IsOptional()
    @IsString()
    comment_review?: string;
}
