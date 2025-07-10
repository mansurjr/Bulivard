import { forwardRef, Module } from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { ReservationController } from "./reservation.controller";
import { UsersModule } from "../users/users.module";
import { SeatModule } from "../seat/seat.module";
import { RestaurantModule } from "../restaurant/restaurant.module";
import { MailModule } from "../mail/mail.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { Reservation } from "./model/reservation.model";

@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService, SequelizeModule],
  imports: [
    UsersModule,
    RestaurantModule,
    forwardRef(() => SeatModule),
    MailModule,
    SequelizeModule.forFeature([Reservation]),
  ],
})
export class ReservationModule {}
