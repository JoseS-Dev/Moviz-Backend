import { TypeNotification } from '../../../../../generated/prisma/enums.js';

export class Notification {
    user_id!: number;
    title_notification!: string;
    message_notification!: string;
    type_notification!: TypeNotification;
    is_read?: boolean;
}
