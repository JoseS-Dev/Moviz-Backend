import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter{
    catch(exception: unknown, host: ArgumentsHost){
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        // Determinamos el estado de la respuesta
        const status = exception instanceof HttpException
        ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        // Luego extraemos el mensaje y los detalles del error
        let message = 'Error Interno del Servidor';
        let details = exception

        if (exception instanceof HttpException) {
            const responseData = exception.getResponse();
            if (typeof responseData === 'string') {
              message = responseData;
            } else if (typeof responseData === 'object' && responseData !== null) {
              message = (responseData as any).message || message;
              details = (responseData as any).error || exception.name;
            }
        } else if (exception instanceof Error) {
          message = exception.message;
        }

        // Se formatea el JSON de la respuesta
        res.status(status).json({
            success: false,
            message: Array.isArray(message) ? message[0] : message, 
            details: details,
            path: req.url,
            timestamp: new Date().toISOString(),
        })
    }
}