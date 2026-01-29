import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentsService {
    constructor(private prisma: PrismaService) {}

    async create(createDepartmentDto: CreateDepartmentDto) {
        const existing = await this.prisma.department.findUnique({
            where: { name: createDepartmentDto.name },
        });

        if (existing) {
            throw new ConflictException('Department already exists');
        }

        return this.prisma.department.create({
            data: createDepartmentDto,
        });
    }

    async findAll() {
        return this.prisma.department.findMany({
            include: {
                _count: {
                    select: { users: true },
                },
            },
        });
    }

    async findOne(id: string) {
        const department = await this.prisma.department.findUnique({
            where: { id },
            include: {
                users: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                    },
                },
            },
        });

        if (!department) {
            throw new NotFoundException('Department not found');
        }

        return department;
    }

    async update(id: string, updateData: Partial<CreateDepartmentDto>) {
        await this.findOne(id);

        return this.prisma.department.update({
            where: { id },
            data: updateData,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.department.delete({
            where: { id },
        });
    }
}
