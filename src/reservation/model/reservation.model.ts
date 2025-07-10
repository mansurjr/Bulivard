import {
  AutoIncrement,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Seat } from "../../seat/model/seat.model";
import { User } from "../../users/models/user.model";
import { Restaurant } from "../../restaurant/models/restaurant.model";
import { Menu } from "../../menu/model/menu.model";

interface ReservationCreationAttrs {
  seatId: number;
  restaurantId: number;
  customerId: number;
  date: Date;
  time: string;
  guestCount: number;
}

@Table({ tableName: "reservation", timestamps: true })
export class Reservation extends Model<Reservation, ReservationCreationAttrs> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @ForeignKey(() => Seat)
  @Column({ type: DataType.INTEGER })
  declare seatId: number;

  @ForeignKey(() => Restaurant)
  @Column({ type: DataType.INTEGER })
  declare restaurantId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  declare customerId: number;

  @Column({ type: DataType.DATE })
  declare date: Date;

  @Column({ type: DataType.STRING })
  declare time: string;

  @Column({ type: DataType.INTEGER })
  declare guestCount: number;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare isChecked: boolean;
}
