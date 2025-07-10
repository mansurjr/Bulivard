import {
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import * as bcrypt from "bcrypt";
import { UserRoles } from "../../common/types/types";
import { Restaurant } from "../../restaurant/models/restaurant.model";
import { Reservation } from "../../reservation/model/reservation.model";

interface IUserAttr {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  role: UserRoles;
  isActive?: boolean;
  isCreator?: boolean;
  activation_link?: string;
  token?: string;
  reset_link?: string;
}

@Table({ tableName: "users", timestamps: true })
export class User extends Model<User, IUserAttr> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare full_name: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare phone_number: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare password: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isActive: boolean;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare role: UserRoles;

  @Default(DataType.UUIDV4)
  @AllowNull
  @Column(DataType.UUID)
  declare activation_link: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare token: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare reset_link: string;

  @HasMany(() => Restaurant, { foreignKey: "ownerId", as: "restaurants" })
  declare restaurants: Restaurant[];

  @HasMany(() => Reservation, { as: "reservations" })
  declare reservations: Reservation[];

  @BeforeCreate
  static async hashBeforeCreate(user: User) {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }

  @BeforeUpdate
  static async hashBeforeUpdate(user: User) {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }
}
