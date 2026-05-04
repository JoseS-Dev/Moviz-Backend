import { 
    StatusShowtime,
    LanguageType 
} from '../../../../../generated/prisma/enums.js'

export class Showtime {
    movie_id!: number;
    room_id!: number;
    start_time!: Date;
    end_time!: Date;
    price_showtime!: number;
    status_showtime!: StatusShowtime;
    language_type?: LanguageType | null;
    is_pre_release?: boolean;
}
