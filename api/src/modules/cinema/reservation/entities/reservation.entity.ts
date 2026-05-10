import { Seat } from "../../seats/entities/seat.entity.js";
import { Booking } from '../../../services/booking/entities/booking.entity.js';

export class Reservation {
    booking_id!: number;
    seat_id!: number;
    seats!: Seat;
    bookings!: Booking;
}