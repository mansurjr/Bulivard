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
import { MenuImageService } from "./menu-image.service";
import { CreateMenuImageDto } from "./dto/create-menu-image.dto";
import { UpdateMenuImageDto } from "./dto/update-menu-image.dto";
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
import { MenuImage } from "./model/menu-image.model";

@ApiTags("Menu Image")
@ApiBearerAuth()
@Controller("menu-image")
@UseGuards(CustomJwtGuard, RolesGuard)
export class MenuImageController {
  constructor(private readonly menuImageService: MenuImageService) {}

  @Post()
  @Roles("admin", "manager")
  @ApiOperation({ summary: "Create a new menu image (admin/manager)" })
  @ApiResponse({ status: 201, type: MenuImage })
  create(@Body() createMenuImageDto: CreateMenuImageDto) {
    return this.menuImageService.create(createMenuImageDto);
  }

  @Get()
  @Roles("admin", "manager", "user")
  @ApiOperation({ summary: "Get all menu images" })
  @ApiResponse({ status: 200, type: [MenuImage] })
  findAll() {
    return this.menuImageService.findAll();
  }

  @Get(":id")
  @Roles("admin", "manager", "user")
  @ApiOperation({ summary: "Get a single menu image by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, type: MenuImage })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.menuImageService.findOne(id);
  }

  @Patch(":id")
  @Roles("admin", "manager")
  @ApiOperation({ summary: "Update a menu image (admin/manager)" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, type: MenuImage })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMenuImageDto: UpdateMenuImageDto
  ) {
    return this.menuImageService.update(id, updateMenuImageDto);
  }

  @Delete(":id")
  @Roles("admin")
  @ApiOperation({ summary: "Delete a menu image (admin only)" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({
    status: 200,
    schema: { example: { message: "Menu image deleted successfully" } },
  })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.menuImageService.remove(id);
  }
}
