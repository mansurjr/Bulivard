import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./users/models/user.model";
import { MailModule } from './mail/mail.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { Restaurant } from "./restaurant/models/restaurant.model";
import { MenuModule } from './menu/menu.module';
import { Menu } from "./menu/model/menu.model";
import { MenuImageModule } from './menu-image/menu-image.module';
import { SeatModule } from './seat/seat.module';
import { MenuImage } from "./menu-image/model/menu-image.model";
import { Seat } from "./seat/model/seat.model";
import { ReservationModule } from './reservation/reservation.module'; 
import { Reservation } from "./reservation/model/reservation.model";
import { BootstrapService } from './start/start.service';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    SequelizeModule.forRoot({
      uri: process.env.uri,
      logging: false,
      autoLoadModels: true,
      // sync : {force : true },
      models: [User, Restaurant, Menu, MenuImage, Seat, Reservation],
    }),
    AuthModule,
    MailModule,
    RestaurantModule,
    MenuModule,
    MenuImageModule,
    SeatModule,
    ReservationModule,
  ],
  providers: [BootstrapService],
})
export class AppModule {}
