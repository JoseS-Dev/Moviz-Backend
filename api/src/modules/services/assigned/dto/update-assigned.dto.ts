import { PartialType } from '@nestjs/mapped-types';
import { CreateAssignedDto } from './create-assigned.dto.js';

export class UpdateAssignedDto extends PartialType(CreateAssignedDto) {}
