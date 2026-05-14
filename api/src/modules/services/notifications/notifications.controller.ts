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
  Query 
} from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { CreateNotificationDto } from './dto/create-notification.dto.js';
import { UpdateNotificationDto } from './dto/update-notification.dto.js';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page') page: number  = 1,
    @Query('size') size: number = 10,
  ) {
    return this.notificationsService.findAll(userId, page, size);
  }

  @Patch('user/:userId/read')
  @HttpCode(HttpStatus.OK)
  async markAsReadAll(@Param('userId', ParseIntPipe) userId: number) {
    return this.notificationsService.markAsReadAll(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.remove(id);
  }
}
