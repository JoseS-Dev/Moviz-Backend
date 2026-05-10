import { 
  Controller, 
  Get, 
  Post, 
  Body,  
  Param, 
  Delete,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  Query 
} from '@nestjs/common';
import { ReservationService } from './reservation.service.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';


@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.reservationService.findAll(page, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.remove(+id);
  }
}
