import { Module } from '@nestjs/common';
import { MenuImageService } from './menu-image.service';
import { MenuImageController } from './menu-image.controller';
import { MenuModule } from '../menu/menu.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { MenuImage } from './model/menu-image.model';

@Module({
  controllers: [MenuImageController],
  providers: [MenuImageService],
  exports: [MenuImageService],
  imports: [MenuModule, SequelizeModule.forFeature([MenuImage])],
})
export class MenuImageModule {}
