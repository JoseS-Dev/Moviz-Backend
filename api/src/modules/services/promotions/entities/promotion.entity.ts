import { TypePromotion } from '../../../../../generated/prisma/enums.js';

export class Promotion {
    code_promotion!: string;
    name_promotion!: string;
    description_promotion?: string | null;
    discount_value!: number;
    type_promotion!: TypePromotion;
    start_date!: Date;
    end_date?: Date | null;
    is_active?: boolean | null;
}
