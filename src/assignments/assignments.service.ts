import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Injectable()
export class AssignmentsService {
    constructor(private prisma: PrismaService) {}

    async create(createAssignmentDto: CreateAssignmentDto, assignedById: string) {
        const { taskId, userId, departmentId } = createAssignmentDto;

        // Validate task exists
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        // Validate either userId or departmentId is provided
        if (!userId && !departmentId) {
            throw new BadRequestException('Either userId or departmentId must be provided');
        }

        // Validate user if provided
        if (userId) {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new NotFoundException('User not found');
            }
        }

        // Validate department if provided
        if (departmentId) {
            const department = await this.prisma.department.findUnique({
                where: { id: departmentId },
            });

            if (!department) {
                throw new NotFoundException('Department not found');
            }
        }

        // Create assignment
        return this.prisma.assignment.create({
            data: {
                taskId,
                userId,
                departmentId,
                assignedById,
            },
            include: {
                task: {
                    select: {
                        id: true,
                        taskName: true,
                        description: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                department: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async findByTask(taskId: string) {
        return this.prisma.assignment.findMany({
            where: { taskId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                department: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                assignedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async remove(id: string) {
        const assignment = await this.prisma.assignment.findUnique({
            where: { id },
        });

        if (!assignment) {
            throw new NotFoundException('Assignment not found');
        }

        return this.prisma.assignment.delete({
            where: { id },
        });
    }
}
