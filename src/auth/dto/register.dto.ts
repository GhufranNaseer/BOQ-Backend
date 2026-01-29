import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEnum(['ADMIN', 'DEPARTMENT_USER'])
    @IsNotEmpty()
    role: 'ADMIN' | 'DEPARTMENT_USER';

    @IsOptional()
    @IsString()
    departmentId?: string;
}
