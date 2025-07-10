import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Menu } from "./model/menu.model";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { RestaurantService } from "../restaurant/restaurant.service";
import { where } from "sequelize";
import { MenuImage } from "../menu-image/model/menu-image.model";

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu)
    private readonly menuModel: typeof Menu,
    private readonly restaurantService: RestaurantService
  ) {}

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const restaurant = await this.restaurantService.findOne(
      createMenuDto.restaurantId
    );
    if (!restaurant) {
      throw new NotFoundException(`Restaurant not found`);
    }
    return await this.menuModel.create(createMenuDto);
  }

  async findAll(): Promise<Menu[]> {
    const menus = await this.menuModel.findAll({
      attributes: ["name", "description", "price"],
      include : {model : MenuImage}
    });
    if (menus.length === 0) {
      throw new NotFoundException(`Menus not found`);
    }
    return menus;
  }

  async findOne(id: number): Promise<Menu> {
    const menu = await this.menuModel.findByPk(id, {
      attributes: ["name", "description", "price"],
    });
    if (!menu) {
      throw new NotFoundException(`Menu not found`);
    }
    return menu;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.findOne(id);

    if (
      updateMenuDto.restaurantId &&
      updateMenuDto.restaurantId !== menu.restaurantId
    ) {
      await this.restaurantService.findOne(updateMenuDto.restaurantId);
    }

    return await menu.update(updateMenuDto);
  }

  async remove(id: number): Promise<{ message: string }> {
    const deleted = await this.menuModel.destroy({ where: { id } });

    if (!deleted) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }

    return { message: `Menu deleted successfully` };
  }
}
