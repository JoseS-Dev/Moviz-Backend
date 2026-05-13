import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssignedService } from './assigned.service.js';
import { CreateAssignedDto } from './dto/create-assigned.dto.js';
import { UpdateAssignedDto } from './dto/update-assigned.dto.js';

@Controller('assigned')
export class AssignedController {
  constructor(private readonly assignedService: AssignedService) {}

  @Post()
  create(@Body() createAssignedDto: CreateAssignedDto) {
    return this.assignedService.create(createAssignedDto);
  }

  @Get()
  findAll() {
    return this.assignedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssignedDto: UpdateAssignedDto) {
    return this.assignedService.update(+id, updateAssignedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignedService.remove(+id);
  }
}
