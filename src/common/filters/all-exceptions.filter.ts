import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger('ExceptionFilter');

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse() as any;
            message = res.message || res;
        } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle Prisma specific errors
            if (exception.code === 'P2002') {
                status = HttpStatus.CONFLICT;
                message = 'Unique constraint failed';
            } else if (exception.code === 'P2025') {
                status = HttpStatus.NOT_FOUND;
                message = 'Record not found';
            }
        }

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: Array.isArray(message) ? message[0] : message, // Simplify class-validator errors
        };

        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(`${request.method} ${request.url}`, (exception as Error).stack);
        } else {
            this.logger.warn(`${request.method} ${request.url} - ${status} - ${JSON.stringify(message)}`);
        }

        response.status(status).json(errorResponse);
    }
}
