import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuImageDto } from './create-menu-image.dto';

export class UpdateMenuImageDto extends PartialType(CreateMenuImageDto) {}
