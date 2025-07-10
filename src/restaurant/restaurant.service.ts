import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Restaurant } from "./models/restaurant.model";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";
import { UsersService } from "../users/users.service";
import { Menu } from "../menu/model/menu.model";

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant)
    private readonly restaurantModel: typeof Restaurant,
    private readonly UserService: UsersService
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    await this.UserService.findManager(createRestaurantDto.ownerId);
    const restaurant = await this.restaurantModel.findOne({
      where: { name: createRestaurantDto.name },
    });
    if (restaurant) {
      throw new NotFoundException(`Restaurant already exists`);
    }
    return await this.restaurantModel.create(createRestaurantDto);
  }

  async findAll() {
    const restaurants = await this.restaurantModel.findAll({
      include: {
        model: Menu,
        attributes: ["name", "description", "price"],
      },
    });
    if (restaurants.length === 0)
      throw new NotFoundException(`Restaurants not found`);
    return restaurants;
  }

  async findOne(id: number) {
    const restaurant = await this.restaurantModel.findByPk(id);
    if (!restaurant) throw new NotFoundException(`Restaurant not found`);
    return restaurant;
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    try {
      const restaurant = await this.findOne(id);
      if (!restaurant) {
        throw new NotFoundException(`Restaurant not found`);
      }
      return await restaurant.update(updateRestaurantDto);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        `Error in updating restaurant ${error.message}`
      );
    }
  }

  async remove(id: number) {
    const restaurant = await this.findOne(id);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant not found`);
    }
    await restaurant.destroy();
    return { message: `Restaurant removed` };
  }
}
