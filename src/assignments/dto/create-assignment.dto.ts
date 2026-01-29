import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateAssignmentDto {
    @IsNotEmpty()
    @IsString()
    taskId: string;

    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsString()
    departmentId?: string;
}
