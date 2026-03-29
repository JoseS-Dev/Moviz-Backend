import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.usersService.create(createUserDto);
    return res.status(201).json({
      message: "Usuario creado exitosamente",
      data: result,
    });
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.usersService.findAll(page, limit);
    return res.status(200).json({
      message: "Usuarios obtenidos exitosamente",
      data: result,
      meta: {
        page: page,
        limit: limit,
        total: result.total,
      }
    })
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.usersService.findOne(+id);
    return res.status(200).json({
      message: "Usuario obtenido exitosamente",
      data: result,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.usersService.update(+id, updateUserDto);
    return res.status(200).json({
      message: "Usuario actualizado exitosamente",
      data: result,
    });
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.usersService.remove(+id);
    return res.status(200).json({
      message: "Usuario eliminado exitosamente",
      data: result,
    });
  }
}
