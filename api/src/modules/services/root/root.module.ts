import { Module } from '@nestjs/common';
import { BookingModule } from '../booking/booking.module.js';
import { BadgesModule } from '../badges/badges.module.js';
import { ReviewsModule } from '../reviews/reviews.module.js';
import { PromotionsModule } from '../promotions/promotions.module.js';

@Module({
    imports: [
        BookingModule,
        BadgesModule,
        ReviewsModule,
        PromotionsModule
    ]
})
export class ServicesModule {}