import { User } from '../../../control/users/entities/user.entity.js';
import { Footage } from '../../../cinema/footage/entities/footage.entity.js'

export class Review {
    user_id!: number;
    movie_id!: number;
    rating_review!: number;
    comment_review?: string | null;
    is_active!: boolean;
    users!: User;
    footage!: Footage;
}
