import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { MenuService } from "./menu.service";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { CustomJwtGuard } from "../common/guards/jwt.guard";
import { RolesGuard } from "../common/guards/role.guard";
import { Roles } from "../common/decorators/role";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

@ApiTags("Menu")
@ApiBearerAuth()
@Controller("menu")
@UseGuards(CustomJwtGuard, RolesGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @Roles("admin", "manager")
  @ApiOperation({ summary: "Create a new menu item" })
  @ApiResponse({ status: 201, description: "Menu item created successfully" })
  @ApiResponse({ status: 404, description: "Restaurant not found" })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @Roles("admin", "manager", "user")
  @ApiOperation({ summary: "Get all menu items" })
  @ApiResponse({ status: 200, description: "List of all menu items" })
  @ApiResponse({ status: 404, description: "Menus not found" })
  findAll() {
    return this.menuService.findAll();
  }

  @Get(":id")
  @Roles("admin", "manager", "user")
  @ApiOperation({ summary: "Get a single menu item by ID" })
  @ApiParam({ name: "id", type: Number, description: "Menu item ID" })
  @ApiResponse({ status: 200, description: "Menu item found" })
  @ApiResponse({ status: 404, description: "Menu not found" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  @Patch(":id")
  @Roles("admin", "manager")
  @ApiOperation({ summary: "Update a menu item" })
  @ApiParam({ name: "id", type: Number, description: "Menu item ID" })
  @ApiResponse({ status: 200, description: "Menu item updated successfully" })
  @ApiResponse({ status: 404, description: "Menu or restaurant not found" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMenuDto: UpdateMenuDto
  ) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(":id")
  @Roles("admin")
  @ApiOperation({ summary: "Delete a menu item" })
  @ApiParam({ name: "id", type: Number, description: "Menu item ID" })
  @ApiResponse({ status: 200, description: "Menu deleted successfully" })
  @ApiResponse({ status: 404, description: "Menu not found" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }
}
