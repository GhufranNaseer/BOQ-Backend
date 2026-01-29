import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CsvParserService } from './csv-parser.service';

@Injectable()
export class TasksService {
    constructor(
        private prisma: PrismaService,
        private csvParser: CsvParserService,
    ) { }

    async uploadCSV(eventId: string, file: Express.Multer.File) {
        // Verify event exists
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        // Parse CSV
        const tasks = await this.csvParser.parseCSV(file.buffer);

        // Create tasks in transaction
        const createdTasks = await this.prisma.$transaction(
            tasks.map((task) =>
                this.prisma.task.create({
                    data: {
                        eventId,
                        ...task,
                    },
                }),
            ),
        );

        return {
            success: true,
            tasksCreated: createdTasks.length,
            message: `Successfully created ${createdTasks.length} tasks`,
        };
    }

    async getEventTasks(eventId: string) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        return this.prisma.task.findMany({
            where: { eventId },
            include: {
                assignments: {
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
                    },
                },
            },
            orderBy: {
                sNo: 'asc',
            },
        });
    }

    async getMyTasks(userId: string, departmentId?: string) {
        return this.prisma.task.findMany({
            where: {
                assignments: {
                    some: {
                        OR: [
                            { userId },
                            departmentId ? { departmentId } : undefined,
                        ].filter(Boolean) as any,
                    },
                },
            },
            include: {
                event: {
                    select: {
                        id: true,
                        name: true,
                        eventDate: true,
                    },
                },
                assignments: {
                    where: {
                        OR: [
                            { userId },
                            departmentId ? { departmentId } : undefined,
                        ].filter(Boolean) as any,
                    },
                    select: {
                        id: true,
                        assignedAt: true,
                        user: {
                            select: { id: true, name: true }
                        },
                        department: {
                            select: { id: true, name: true }
                        }
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: string) {
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: {
                event: true,
                assignments: {
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
                    },
                },
            },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        return task;
    }
}
