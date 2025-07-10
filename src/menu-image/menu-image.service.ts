import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { MenuImage } from "./model/menu-image.model";
import { CreateMenuImageDto } from "./dto/create-menu-image.dto";
import { UpdateMenuImageDto } from "./dto/update-menu-image.dto";
import { MenuService } from "../menu/menu.service";

@Injectable()
export class MenuImageService {
  constructor(
    @InjectModel(MenuImage)
    private readonly menuImageModel: typeof MenuImage,
    private readonly menuService: MenuService
  ) {}

  async create(createMenuImageDto: CreateMenuImageDto): Promise<MenuImage> {
    await this.menuService.findOne(createMenuImageDto.menuId);
    return await this.menuImageModel.create(createMenuImageDto);
  }

  async findAll(): Promise<MenuImage[]> {
    const images = await this.menuImageModel.findAll();
    if (images.length === 0) {
      throw new NotFoundException("No menu images found");
    }
    return images;
  }

  async findOne(id: number): Promise<MenuImage> {
    const image = await this.menuImageModel.findByPk(id);
    if (!image) {
      throw new NotFoundException(`MenuImage with ID ${id} not found`);
    }
    return image;
  }

  async update(
    id: number,
    updateMenuImageDto: UpdateMenuImageDto
  ): Promise<MenuImage> {
    const image = await this.findOne(id);

    if (
      updateMenuImageDto.menuId &&
      updateMenuImageDto.menuId !== image.menuId
    ) {
      await this.menuService.findOne(updateMenuImageDto.menuId);
    }

    return await image.update(updateMenuImageDto);
  }

  async remove(id: number): Promise<{ message: string }> {
    const image = await this.findOne(id);
    await image.destroy();
    return { message: `Menu image deleted successfully` };
  }
}