import { forwardRef, Module, Res } from "@nestjs/common";
import { SeatService } from "./seat.service";
import { SeatController } from "./seat.controller";
import { RestaurantModule } from "../restaurant/restaurant.module";
import { Seat } from "./model/seat.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { ReservationModule } from "../reservation/reservation.module";

@Module({
  controllers: [SeatController],
  providers: [SeatService],
  exports: [SeatService],
  imports: [
    RestaurantModule,
    SequelizeModule.forFeature([Seat]),
    forwardRef(() => ReservationModule),
  ],
})
export class SeatModule {}
