import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyEmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(4, 6)
    code: string;
}