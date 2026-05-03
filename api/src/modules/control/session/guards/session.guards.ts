import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../../prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { SessionAutheticationResponse } from '../session.constants.js';
import { settings } from '../../../../../config/settings.config.js';

// Clase del middleware de autenticación de sesión
@Injectable()
export class SessionGuard implements CanActivate {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    private extractTokenFromHeader(req: any) : string | null {
       const [type, token] = req.headers.authorization?.split(' ') ?? [];
       return type === 'Bearer' ? token : null; 
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(req);
        if(!token) throw new UnauthorizedException('No se propocion el token de autorización');
        try{
            const secret = settings.jwtSecretKey;
            // Se verifica el JWT
            const payload = await this.jwtService.verifyAsync(token, {secret});
            // Verifica si la session esta activa en la base de datos
            const session = await this.prisma.sessions.findFirst({
                where: {token: token}
            });
            if(!session) throw new UnauthorizedException('Sesión no encontrada');
            // Si hay una sesión se inyecta en la pertición el payload
            req['user'] = payload
            return true 
        }
        catch(error){
           throw new UnauthorizedException('Token inválido o sesión expirada'); 
        }
    }
}