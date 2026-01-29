import {
    Controller,
    Get,
    Post,
    Param,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post('upload-csv/:eventId')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @UseInterceptors(FileInterceptor('file'))
    async uploadCSV(@Param('eventId') eventId: string, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        if (!file.originalname.endsWith('.csv')) {
            throw new BadRequestException('Only CSV files are allowed');
        }

        return this.tasksService.uploadCSV(eventId, file);
    }

    @Get('event/:eventId')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    getEventTasks(@Param('eventId') eventId: string) {
        return this.tasksService.getEventTasks(eventId);
    }

    @Get('my-tasks')
    getMyTasks(@CurrentUser() user: any) {
        return this.tasksService.getMyTasks(user.id, user.departmentId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tasksService.findOne(id);
    }
}
