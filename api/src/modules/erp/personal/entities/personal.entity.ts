import {roleStaff} from '../../../../../generated/prisma/enums.js';

export class Personal {
    role_staff!: roleStaff;
    name_staff!: string;
    email_staff!: string;
    identification_number?: string | null;
    mobile_staff?: string | null;
    is_active?: boolean
}
