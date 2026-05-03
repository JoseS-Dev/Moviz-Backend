import { PartialType } from '@nestjs/mapped-types';
import { CreateFootageDto } from './create-footage.dto.js';

export class UpdateFootageDto extends PartialType(CreateFootageDto) {}
