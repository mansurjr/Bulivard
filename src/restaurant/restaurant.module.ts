import { Module } from "@nestjs/common";
import { RestaurantService } from "./restaurant.service";
import { RestaurantController } from "./restaurant.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Restaurant } from "./models/restaurant.model";
import { UsersModule } from "../users/users.module";

@Module({
  controllers: [RestaurantController],
  providers: [RestaurantService],
  imports: [SequelizeModule.forFeature([Restaurant]), UsersModule],
  exports: [RestaurantService],
})
export class RestaurantModule {}
