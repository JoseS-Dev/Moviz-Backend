import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BadgesService } from './badges.service.js';
import { CreateBadgeDto } from './dto/create-badge.dto.js';
import { UpdateBadgeDto } from './dto/update-badge.dto.js';
import multer from 'multer';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('icon_badge', {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/badges');
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      }
    }),
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  }))
  async create(
    @Body() createBadgeDto: CreateBadgeDto,
    @UploadedFile() icon_badge: Express.Multer.File,
  ) {
    if(!icon_badge) throw new BadRequestException('El icono de la insignia no fue proporcionado');
    const filePath = `uploads/badges/${icon_badge.filename}`;
    return this.badgesService.create(createBadgeDto, filePath);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.badgesService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.badgesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateBadgeDto: UpdateBadgeDto) {
    return this.badgesService.update(+id, updateBadgeDto);
  }

  @Patch(':id/status')
  async changeStatus(@Param('id', ParseIntPipe) id: number, @Body('isActive') isActive: boolean) {
    return this.badgesService.changeStatus(id, isActive);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.badgesService.remove(id);
  }
}
