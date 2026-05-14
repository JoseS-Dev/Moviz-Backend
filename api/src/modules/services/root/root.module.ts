import { Module } from '@nestjs/common';
import { BookingModule } from '../booking/booking.module.js';
import { BadgesModule } from '../badges/badges.module.js';
import { ReviewsModule } from '../reviews/reviews.module.js';
import { PromotionsModule } from '../promotions/promotions.module.js';
import { AssignedModule } from '../assigned/assigned.module.js';
import { DiscountsModule } from '../discounts/discounts.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
    imports: [
        BookingModule,
        BadgesModule,
        ReviewsModule,
        PromotionsModule,
        AssignedModule,
        DiscountsModule,
        NotificationsModule
    ]
})
export class ServicesModule {}