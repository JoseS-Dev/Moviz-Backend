import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  UseGuards 
} from '@nestjs/common';
import { SessionService } from './session.service.js';
import { User } from '../../../common/decorators/user.decorator.js';
import { CreateSessionDto } from './dto/create-session.dto.js';
import type { SessionAutheticationResponse } from './session.constants.js';
import { SessionGuard } from './guards/session.guards.js';


@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('/login')
  async login(
    @Body() createSessionDto: CreateSessionDto,
  ) {
    const result = await this.sessionService.login(createSessionDto);
    return {
      success: true,
      message: "Inicio de sesión exitoso",
      data: result
    }
  }

  @Post('logout')
  @UseGuards(SessionGuard)
  async logout(
    @User() user: SessionAutheticationResponse
  ){
    const result = await this.sessionService.logout(user.sub);
    return {
      success: true,
      message: "Cierre de sesión exitoso",
      data: result
    }
  }

  @Get('/verify')
  @UseGuards(SessionGuard)
  async verify(
    @User() user: SessionAutheticationResponse
  ){
    return {
      success: true,
      message: 'Usuario autenticado',
      isAuthenticated: true,
      user: user
    }
  }

}
