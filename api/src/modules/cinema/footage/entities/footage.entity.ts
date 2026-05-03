import { typeFootage } from "../../../../../generated/prisma/enums.js";

export class Footage {
    title_footage!: string;
    description_footage?: string | null;
    type_footage!: typeFootage;
    duration!: number;
    genre_footage!: string;
    rating_footage?: number | null;
    poster_url?: string | null;
    backdrop_url?: string | null;
    trailer_url?: string | null;
    release_date?: Date | null;
    language_footage!: string;
    director_footage!: string;
    cast_footage!: string[] 
}
