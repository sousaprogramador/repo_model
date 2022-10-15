import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
class QueryFailFilter implements ExceptionFilter {
    private logger = new Logger();

    catch(exception: QueryFailedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        this.logger.error(exception);

        if (exception.driverError.code === 'ER_NO_REFERENCED_ROW_2') {
            response
                .status(400)
                .json({
                    statusCode: 400,
                    message: 'invalid-reference'
                });
        }

        response
            .status(500)
            .json({
                statusCode: 500,
                message: 'internal-server-error'
            });
    }
}

export { QueryFailFilter };
