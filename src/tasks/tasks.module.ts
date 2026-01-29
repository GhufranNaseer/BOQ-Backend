import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { CsvParserService } from './csv-parser.service';

@Module({
    controllers: [TasksController],
    providers: [TasksService, CsvParserService],
    exports: [TasksService],
})
export class TasksModule {}
