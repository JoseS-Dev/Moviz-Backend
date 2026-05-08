import { StatusBooking } from "../../../../../generated/prisma/enums.js";

export class Booking {
    user_id!: number;
    showtime_id!: number;
    staff_id?: number | null;
    total_price!: number;
    reservation_code!: string;
    payment_method?: string | null;
    status_booking!: StatusBooking
    reason_cancellation?: string | null;
}
