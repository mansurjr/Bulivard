import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Restaurant } from "../../restaurant/models/restaurant.model";
import { MenuImage } from "../../menu-image/model/menu-image.model";

interface IMenuAttr {
  name: string;
  description: string;
  price: string;
  restaurantId: number;
}

@Table({ tableName: "menu", timestamps: true })
export class Menu extends Model<Menu, IMenuAttr> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare price: string;

  @AllowNull
  @Column({ type: DataType.STRING })
  declare description: string;

  @ForeignKey(() => Restaurant)
  @Column({ type: DataType.INTEGER })
  declare restaurantId: number;

  @HasMany(() => MenuImage)
  declare menuImages: MenuImage[];
}
