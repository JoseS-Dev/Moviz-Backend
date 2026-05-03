import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../../../prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { SessionAutheticationResponse } from '../session.constants.js';
import { settings } from '../../../../../config/settings.config.js';

function extractTokenFromHeader(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    return token;
}

interface RequestWithUser extends Request {
    user?: SessionAutheticationResponse;
}

// Clase del middleware de autenticación de sesión
@Injectable()
export class SessionAuthenticationMiddleware implements NestMiddleware {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async use(req: RequestWithUser, res: Response, next: NextFunction){
        const token = extractTokenFromHeader(req);
        if(!token) return new UnauthorizedException('No se proporcionó un token de autenticación');
        try {
            const secret = settings.jwtSecretKey;
            if(!secret) throw new Error('No se ha configurado la clave secreta para JWT');
            const decoded = this.jwtService.verify(token, { secret }) as SessionAutheticationResponse;
            if(!decoded.sub) throw new UnauthorizedException('Token de autenticación inválido');
            const session = await this.prisma.sessions.findFirst({
                where: { token }
            });
            if(!session) throw new UnauthorizedException('Token de autenticación no válido o sesión cerrada');
            req.user = decoded;
            next();
        }
        catch(error){
            throw new UnauthorizedException('Token de autenticación inválido o expirado');
        }
    }
}