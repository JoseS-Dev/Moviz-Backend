import {
    IsNumber,
    IsNotEmpty,

} from 'class-validator';
export class CreateAssignedDto {
    @IsNumber()
    @IsNotEmpty()
    user_id!: number;

    @IsNumber()
    @IsNotEmpty()
    badge_id!: number;
}
