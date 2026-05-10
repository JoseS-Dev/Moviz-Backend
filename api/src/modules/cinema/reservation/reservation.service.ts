import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { UpdateReservationDto } from './dto/update-reservation.dto.js';
import { PrismaService } from '../../../prisma.service.js';
import { Reservation } from './entities/reservation.entity.js';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}
  async create(createReservationDto: CreateReservationDto) : Promise<Reservation> {
    if(!createReservationDto) throw new BadRequestException('Los datos no fueron proporcionados');
    // Se verifica que exista la silla y la reservación en cuestión
    const [existingSeat, existingBooking, existingReservation] = await Promise.all([
      this.prisma.seats.findUnique({
        where: {id: createReservationDto.seat_id}
      }),
      this.prisma.bookings.findUnique({
        where: {id: createReservationDto.booking_id}
      }),
      this.prisma.reservedSeats.findFirst({
        where: {seat_id: createReservationDto.seat_id}
      })
    ]);
    if(!existingSeat) throw new NotFoundException('La silla no existe');
    if(!existingBooking) throw new NotFoundException('La reservación no existe');
    if(existingReservation) throw new ConflictException('Ya existe una reservación para esta silla');
    // Si todo esta bien, se crea la reservación
    const reservation = await this.prisma.reservedSeats.create({
      data: createReservationDto,
      include: {
        seats: true,
        bookings: true
      }
    });
    if(!reservation) throw new BadRequestException('La reservación no pudo ser creada');
    return reservation;
  }

  async findAll(page: number = 1, limit: number = 10) : Promise<{reservations: Reservation[], total: number}> {
    const skip = (page - 1) * limit;
    // Se cuenta el total de registros
    const total = await this.prisma.reservedSeats.count();
    const reservations = await this.prisma.reservedSeats.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        seats: true,
        bookings: true
      }
    });
    return {reservations, total};
  }

  async findOne(id: number) : Promise<Reservation> {
    if(!id) throw new BadRequestException('El ID no fue proporcionado');
    const reservation = await this.prisma.reservedSeats.findUnique({
      where: {id},
      include: {
        seats: true,
        bookings: true
      }
    });
    if(!reservation) throw new NotFoundException('La reservación no existe');
    return reservation;
  }


  async remove(id: number) : Promise<Reservation> {
    if(!id) throw new BadRequestException('El ID no fue proporcionado');
    // Se verifica que exista la reservación
    const existingReservation = await this.findOne(id);
    if(!existingReservation) throw new NotFoundException('La reservación no existe');
    // Se elimina la reservación
    const deletedReservation = await this.prisma.reservedSeats.delete({
      where: {id},
      include: {
        seats: true,
        bookings: true
      }
    });
    if(!deletedReservation) throw new NotFoundException('La reservación no pudo ser eliminada');
    return deletedReservation;
  }
}
