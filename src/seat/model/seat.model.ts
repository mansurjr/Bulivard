import { DataTypes } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Restaurant } from "../../restaurant/models/restaurant.model";
import { Reservation } from "../../reservation/model/reservation.model";

interface ISeatAttr {
  capacity: number;
  price: string;
  IsVip: boolean;
  restaurantId: number;
}

@Table({ tableName: "seats", timestamps: false })
export class Seat extends Model<Seat, ISeatAttr> {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataTypes.INTEGER })
  declare id: number;

  @AllowNull(false)
  @Column({ type: DataTypes.INTEGER })
  declare capacity: number;

  @AllowNull(false)
  @Column({ type: DataTypes.STRING })
  declare price: string;

  @Column({ type: DataTypes.BOOLEAN })
  declare IsVip: boolean;

  @ForeignKey(() => Restaurant)
  @Column({ type: DataTypes.INTEGER })
  declare restaurantId: number;

  @HasMany(() => Reservation, { as: "reservations" })
  declare reservations: Reservation[];
}
