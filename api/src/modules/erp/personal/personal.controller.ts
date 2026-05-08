import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  HttpStatus,
  HttpCode,
  ParseIntPipe, 
  Query
} from '@nestjs/common';
import { PersonalService } from './personal.service.js';
import { CreatePersonalDto } from './dto/create-personal.dto.js';
import { UpdatePersonalDto } from './dto/update-personal.dto.js';

@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

  @Post()
  async create(@Body() createPersonalDto: CreatePersonalDto) {
    return this.personalService.create(createPersonalDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.personalService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.personalService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePersonalDto: UpdatePersonalDto) {
    return this.personalService.update(id, updatePersonalDto);
  }

  @Patch(':id/status')
  async changeStatus(@Param('id', ParseIntPipe) id: number, @Body('isActive') isActive: boolean) {
    return this.personalService.changeStatus(id, isActive);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.personalService.remove(id);
  }
}
