import { Module } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { MenuController } from "./menu.controller";
import { Menu } from "./model/menu.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { RestaurantModule } from "../restaurant/restaurant.module";

@Module({
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
  imports: [SequelizeModule.forFeature([Menu]), RestaurantModule],
})
export class MenuModule {}
