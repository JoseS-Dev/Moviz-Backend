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
import { AssignedService } from './assigned.service.js';
import { CreateAssignedDto } from './dto/create-assigned.dto.js';
import { UpdateAssignedDto } from './dto/update-assigned.dto.js';

@Controller('assigned')
export class AssignedController {
  constructor(private readonly assignedService: AssignedService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAssignedDto: CreateAssignedDto) {
    return this.assignedService.create(createAssignedDto);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page') page: number  = 1,
    @Query('size') size: number = 10,
  ) {
    return this.assignedService.findAll(userId, page, size);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assignedService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.assignedService.remove(id);
  }
}
