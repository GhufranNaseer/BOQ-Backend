import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AssignmentsController {
    constructor(private readonly assignmentsService: AssignmentsService) {}

    @Post()
    create(@Body() createAssignmentDto: CreateAssignmentDto, @CurrentUser() user: any) {
        return this.assignmentsService.create(createAssignmentDto, user.id);
    }

    @Get('task/:taskId')
    findByTask(@Param('taskId') taskId: string) {
        return this.assignmentsService.findByTask(taskId);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.assignmentsService.remove(id);
    }
}
