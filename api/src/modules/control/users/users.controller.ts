import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);
    return {
      success: true,
      message: 'Usuario creado exitosamente',
      data: result,
    };
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const result = await this.usersService.findAll(page, limit);
    return {
      success: true,
      message: 'Usuarios obtenidos exitosamente',
      data: result,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.usersService.findOne(id);
    return {
      success: true,
      message: 'Usuario obtenido exitosamente',
      data: result,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = await this.usersService.update(id, updateUserDto);
    return {
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: result,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.usersService.remove(id);
    return {
      success: true,
      message: 'Usuario eliminado exitosamente',
      data: result,
    };
  }
}
