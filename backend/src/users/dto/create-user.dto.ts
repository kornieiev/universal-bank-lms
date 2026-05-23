import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({message: "Name should be a string"})
  @IsNotEmpty()
  @MinLength(3, {message: 'The name must be at least 3 characters long'})
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString({message: "The password must be a string"})
  @IsNotEmpty()
  @MinLength(6, {message: "The password must be at least 6 characters long"})
  password: string;

  @IsString({message: "The password confirmation must be a string"})
  @IsNotEmpty()
  @MinLength(6, {message: "The password must be at least 6 characters long"})
  password_confirmation: string;
}
