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
import { BookingService } from './booking.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBookingDto: CreateBookingDto) {
    return await this.bookingService.create(createBookingDto);
  }

  @Get('showtime/:showtimeId')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('showtimeId', ParseIntPipe) showtimeId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return await this.bookingService.findAll(showtimeId, page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.bookingService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateBookingDto: UpdateBookingDto
  ) {
    return await this.bookingService.update(id, updateBookingDto);
  }

  @Patch(':id/reason')
  async addReasonCancellation(
    @Param('id', ParseIntPipe) id: number, 
    @Body('reason') reason: string
  ){
    return await this.bookingService.addReasonCancellation(id, reason)
  } 

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number
  ) {
    return await this.bookingService.remove(id);
  }
}
