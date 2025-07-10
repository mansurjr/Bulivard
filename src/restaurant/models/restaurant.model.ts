import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { User } from "../../users/models/user.model";
import { Menu } from "../../menu/model/menu.model";
import { Seat } from "../../seat/model/seat.model";
import { Reservation } from "../../reservation/model/reservation.model";

interface IRestAttr {
  name: string;
  description: string;
  ownerId: number;
  openTime: string;
  closeTime: string;
  rating: number;
  social: string;
  contact: string;
  location: string;
  long: string;
  lat: string;
}

@Table({ tableName: "restaurant", timestamps: true })
export class Restaurant extends Model<Restaurant, IRestAttr> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.STRING })
  declare name: string;

  @Column({ type: DataType.STRING })
  declare description: string;

  @Column({ type: DataType.TIME })
  declare openTime: string;

  @Column({ type: DataType.TIME })
  declare closeTime: string;

  @Column({ type: DataType.SMALLINT })
  declare rating: number;

  @Column({ type: DataType.STRING })
  declare social: string;

  @Column({ type: DataType.STRING })
  declare contact: string;

  @Column({ type: DataType.STRING })
  declare location: string;

  @Column({ type: DataType.STRING })
  declare long: string;

  @Column({ type: DataType.STRING })
  declare lat: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  declare ownerId: number;

  @BelongsTo(() => User, { as: "owner" })
  declare owner: User;

  @HasMany(() => Menu, { as: "menu" })
  declare menu: Menu[];

  @HasMany(() => Seat, { as: "seats" })
  declare seats: Seat[];

  @HasMany(() => Reservation, { as: "reservations" })
  declare reservations: Reservation[];
}
