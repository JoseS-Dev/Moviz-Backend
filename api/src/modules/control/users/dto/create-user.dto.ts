import { IsEmail, IsNotEmpty, IsString } from 'class-validator';


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    names: string;

    @IsString()
    @IsNotEmpty()
    last_names: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password_hash: string;

    @IsString()
    @IsNotEmpty()
    username: string;
}
