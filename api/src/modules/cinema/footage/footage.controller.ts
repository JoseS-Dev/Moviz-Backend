import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FootageService } from './footage.service.js';
import { CreateFootageDto } from './dto/create-footage.dto.js';
import { UpdateFootageDto } from './dto/update-footage.dto.js';

@Controller('footage')
export class FootageController {
  constructor(private readonly footageService: FootageService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFootageDto: CreateFootageDto) {
    return await this.footageService.create(createFootageDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.footageService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.footageService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFootageDto: UpdateFootageDto,
  ) {
    return await this.footageService.update(id, updateFootageDto);
  }

  @Patch(':id/status')
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive') isActive: boolean,
  ) {
    return await this.footageService.changeStatus(id, isActive);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.footageService.remove(id);
  }
}
