import { Controller, Get, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service.js';
import { CreateSessionDto } from './dto/create-session.dto.js';
import type { Request, Response} from 'express'
import type { SessionAutheticationResponse } from './session.constants.js';
import { SessionAuthenticationMiddleware } from './guards/session.guards.js';


@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('/login')
  async login(
    @Body() createSessionDto: CreateSessionDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.sessionService.login(createSessionDto);
    return res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: result
    })
  }

  @Post('logout')
  @UseGuards(SessionAuthenticationMiddleware)
  async logout(
    @Req() req: Request & { user: SessionAutheticationResponse },
    @Res() res: Response
  ){
    const { sub } = req.user;
    const result = await this.sessionService.logout(sub);
    return res.status(200).json({
      success: true,
      message: "Cierre de sesión exitoso",
      data: result
    })
  }

  @Get('/verify')
  @UseGuards(SessionAuthenticationMiddleware)
  async verify(
    @Req() req: Request & { user: SessionAutheticationResponse },
    @Res() res: Response
  ){
    if(!req.user) return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado',
      isAuthenticated: false
    })
    return res.status(200).json({
      success: true,
      message: 'Usuario autenticado',
      isAuthenticated: true,
      user: req.user
    })
  }

}
