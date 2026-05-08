import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonalDto } from './create-personal.dto.js';

export class UpdatePersonalDto extends PartialType(CreatePersonalDto) {}
