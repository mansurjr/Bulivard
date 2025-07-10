import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { User } from "./models/user.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserRoles } from "../common/types/types";
import { Restaurant } from "../restaurant/models/restaurant.model";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Users")
@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly UserModel: typeof User) {}

  async createUser(createUserDto: CreateUserDto, link?: string | null) {
    try {
      const candidate = await this.findByEmailOrPhone(
        createUserDto.email,
        createUserDto.phone_number
      );
      if (candidate) {
        throw new ConflictException("This number or email already registered");
      }

      const user = await this.UserModel.create({
        ...createUserDto,
        role: createUserDto.role || UserRoles.CUSTOMER,
      });
      return { message: `${user.role} created successfully`, user };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "Internal Server Error: " + error.message
      );
    }
  }

  async findAll(role?: UserRoles) {
    if (role !== undefined && !Object.values(UserRoles).includes(role)) {
      throw new BadRequestException(`Invalid role: ${role}`);
    }
    const users = await this.UserModel.findAll({
      where: role ? { role } : undefined,
      attributes: ["id", "full_name", "email", "phone_number", "role"],
      include: {
        model: Restaurant,
        attributes: ["name"],
      },
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.UserModel.findByPk(id, {
      attributes: [
        "id",
        "full_name",
        "email",
        "phone_number",
        "isActive",
        "role",
      ],
    });
    if (!user) {
      throw new ConflictException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.UserModel.findByPk(id);
    if (!user) {
      throw new ConflictException(`User with ID ${id} not found`);
    }

    await user.update(updateUserDto);
    return { message: "User updated successfully", user };
  }

  async remove(id: number) {
    const user = await this.UserModel.findByPk(id);
    if (!user) {
      throw new ConflictException(`User with ID ${id} not found`);
    }

    await user.destroy();
    return { message: "User removed successfully" };
  }

  async findByEmailOrPhone(email: string, phone?: string) {
    const conditions = [{ email }];

    if (phone) {
      conditions.push({ phone_number: phone } as any);
    }

    return await this.UserModel.findOne({
      where: {
        [Op.or]: conditions,
      },
    });
  }

  async findByActivationLink(activationLink: string) {
    return await this.UserModel.findOne({
      where: {
        activation_link: activationLink,
      },
    });
  }

  async findByResetLink(resetLink: string) {
    return await this.UserModel.findOne({
      where: {
        reset_link: resetLink,
      },
    });
  }

  async activateManager(id: number) {
    const user = await this.UserModel.findOne({
      where: {
        id,
        role: UserRoles.MANAGER,
      },
    });
    if (!user) {
      throw new ConflictException(`Manager with ID ${id} not found`);
    }
    user.isActive = true;
    await user.save();
    return { message: "Manager activated successfully" };
  }

  async findManager(id: number) {
    const manager = await this.UserModel.findOne({
      where: {
        role: UserRoles.MANAGER,
        id,
      },
    });
    if (!manager) {
      throw new ConflictException(`Manager not found`);
    }
    return manager;
  }
}
