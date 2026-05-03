import {IsNumber, IsNotEmpty, IsBoolean, IsOptional} from 'class-validator'

export class CreateFavoriteDto {
    @IsNumber()
    @IsNotEmpty()
    user_id!: number

    @IsNumber()
    @IsNotEmpty()
    movie_id!: number

    @IsBoolean()
    @IsOptional()
    is_favorite?: boolean
}
