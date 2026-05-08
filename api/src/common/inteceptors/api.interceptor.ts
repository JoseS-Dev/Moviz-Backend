// src/common/interceptors/response.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api.interfaces.js';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    
    return next.handle().pipe(
      map((payload) => {
        // 1. Dinamismo de mensajes según el método HTTP
        const methodMessages = {
          POST: 'Recurso creado exitosamente',
          GET: 'Recurso(s) recuperado(s) exitosamente',
          PATCH: 'Actualización exitosa',
          PUT: 'Actualización exitosa',
          DELETE: 'Eliminación exitosa',
        };

        // 2. Extraer metadatos automáticamente si vienen del servicio (paginación)
        // Esto asume que tu servicio podría devolver { data: [...], total: 100, page: 1 }
        const hasMeta = payload && payload.total !== undefined;

        return {
          success: response.statusCode >= 200 && response.statusCode < 300,
          message: payload?.message || methodMessages[request.method] || 'Operación exitosa',
          
          // Si el payload tiene una propiedad 'data', usamos esa. 
          // Si no, y el payload es el objeto directo, lo usamos a él.
          data: payload?.data !== undefined ? payload.data : payload,

          // Si detectamos propiedades de paginación, armamos el objeto meta
          meta: payload?.meta || (hasMeta ? {
            total: payload.total,
            page: payload.page,
            lastPage: payload.lastPage,
            limit: payload.limit
          } : undefined),
        };
      }),
    );
  }
}