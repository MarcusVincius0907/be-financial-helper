import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export interface User {
  _id?: string,
  email: string,
  password: string,
}


export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}


export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
