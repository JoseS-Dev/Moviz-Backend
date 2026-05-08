import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';
import {PrismaService} from '../../../prisma.service.js'
import { Booking } from './entities/booking.entity.js';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService){}
  
  async create(createBookingDto: CreateBookingDto) : Promise<Booking> {
    if(!createBookingDto) throw new BadRequestException('Los datos no fueron propocionados');
    // Se verifica que exista el usuario y la función en cuestión
    const [existingUser, existingShowTimes] = await Promise.all([
      this.prisma.users.findUnique({
        where: {id: createBookingDto.user_id}
      }),
      this.prisma.showtimes.findUnique({
        where: {id: createBookingDto.showtime_id}
      })
    ]);
    if(!existingUser) throw new NotFoundException('El usuario no fue encotrado');
    if(!existingShowTimes) throw new NotFoundException('La función no existe');
    // Si el usuario compro la entrada fisicamente , se tiene que verificar que venga la persona que atendio a dicho usuario
    if(createBookingDto.staff_id){
      // Se verifica que exista dicho personal
      const existingStaff = await this.prisma.staff.findUnique({
        where: {id: createBookingDto.staff_id}
      });
      if(!existingStaff) throw new NotFoundException('El personal no existe')
    };
    // Si todo esta bien , se crea la reserva de la función del usuario
    const newBooking = await this.prisma.bookings.create({
      data: createBookingDto
    });
    if(!newBooking) throw new BadRequestException('No se pudo crear la reserva del usuario');
    return newBooking
  }

  async findAll(
    showtimeId: number,
    page: number = 1,
    limit: number = 10
  ) : Promise<{bookings: Booking[], total: number}> {
    if(!showtimeId) throw new BadRequestException('El ID de la función no fue propocionada');
    // Se verifica que existe la funcióm
    const existingShowTimes = await this.prisma.showtimes.findUnique({
      where: {id: showtimeId}
    });
    if(!existingShowTimes) throw new NotFoundException('La función no existen');
    const skip = (page - 1) * limit;
    // Obtengo el total de función que hay tiene una función
    const totalBookings = await this.prisma.bookings.count({
      where: {showtime_id: showtimeId}
    });
    // Se obtiene todas las reservas de una función en común
    const bookings = await this.prisma.bookings.findMany({
      skip: skip,
      take: limit,
      where: {showtime_id: showtimeId},
      orderBy: {showtimes: {end_time: 'asc'}}
    });
    return {bookings, total: totalBookings}
  }

  async findOne(id: number) : Promise<Booking> {
    if(!id) throw new BadRequestException('El ID no fue propocionado');
    const booking = await this.prisma.bookings.findUnique({
      where: {id}
    });
    if(!booking) throw new NotFoundException('No existe dicha reserva');
    return booking
  }

  async update(id: number, updateBookingDto: UpdateBookingDto)  : Promise<Partial<Booking>>{
    if(!id) throw new BadRequestException('El ID no fue propocionado');
    if(!updateBookingDto) throw new BadRequestException('Los datos a actualizar no fueron propocionados');
    // Se verifica que exista la reserva
    const existingBokking = await this.findOne(id);
    if(!existingBokking) throw new NotFoundException('No existe la reserva en cuestión');
    // Si existe , se procede a actualizar dicha reserva
    const updatedBooking = await this.prisma.bookings.update({
      where: {id},
      data: updateBookingDto
    });
    if(!updatedBooking) throw new BadRequestException('No se pudo actualizar dicha reserva');
    return updatedBooking
  }

  async addReasonCancellation(id: number, reason: string) : Promise<Booking>{
    if(!id) throw new BadRequestException('El ID no fue propocionado');
    // Se verifica si existe la reserva
    const existingBooking = await this.findOne(id);
    if(!existingBooking) throw new NotFoundException('No existe dicha reserva');
    // Si existe se actualiza el estado a cancelado y se coloca el motivo de la cancelación
    const changestatus = await this.prisma.bookings.update({
      where: {id},
      data: {
        status_booking: 'Cancelada',
        reason_cancellation: reason
      }
    });
    if(!changestatus) throw new BadRequestException('No se pudo actualizar el estado de la reserva');
    return changestatus
  }

  async remove(id: number) {
    if(!id) throw new BadRequestException('El ID no fue propocionado');
    // Se verifica que exista la reserva
    const existingBooking = await this.findOne(id);
    if(!existingBooking) throw new NotFoundException('No existe dicha reserva');
    // Si existe, se elimina dicha reserva
    const deletedBooking = await this.prisma.bookings.delete({
      where: {id}
    });
    if(!deletedBooking) throw new BadRequestException('No se pudo borrar la reserva en cuestión')
    return deletedBooking
  }
}
