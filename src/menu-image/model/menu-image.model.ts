import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Menu } from "../../menu/model/menu.model";

interface IMenuAttr {
  url: string;
  menuId: number;
}

@Table({ tableName: "menuImages", timestamps: true })
export class MenuImage extends Model<MenuImage, IMenuAttr> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.STRING })
  declare url: string;

  @ForeignKey(() => Menu)
  @Column({ type: DataType.INTEGER })
  declare menuId: number;
}
