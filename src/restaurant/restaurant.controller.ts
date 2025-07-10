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
import { RestaurantService } from "./restaurant.service";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";
import { Roles } from "../common/decorators/role";
import { CustomJwtGuard } from "../common/guards/jwt.guard";
import { RolesGuard } from "../common/guards/role.guard";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { Restaurant } from "./models/restaurant.model";

@ApiTags("Restaurants")
@ApiBearerAuth()
@Controller("restaurant")
@UseGuards(CustomJwtGuard, RolesGuard)
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @Roles("admin", "manager")
  @ApiOperation({ summary: "Create a new restaurant" })
  @ApiResponse({
    status: 201,
    description: "Restaurant created successfully",
    type: Restaurant,
  })
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.create(createRestaurantDto);
  }

  @Get()
  @Roles("admin", "manager", "user")
  @ApiOperation({ summary: "Get all restaurants" })
  @ApiResponse({
    status: 200,
    description: "List of restaurants",
    type: [Restaurant],
  })
  findAll() {
    return this.restaurantService.findAll();
  }

  @Get(":id")
  @Roles("admin", "manager", "user")
  @ApiOperation({ summary: "Get a restaurant by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({
    status: 200,
    description: "Restaurant details",
    type: Restaurant,
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.restaurantService.findOne(id);
  }

  @Patch(":id")
  @Roles("admin", "manager")
  @ApiOperation({ summary: "Update a restaurant" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Restaurant updated successfully" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateRestaurantDto: UpdateRestaurantDto
  ) {
    return this.restaurantService.update(id, updateRestaurantDto);
  }

  @Delete(":id")
  @Roles("admin")
  @ApiOperation({ summary: "Delete a restaurant" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Restaurant deleted successfully" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.restaurantService.remove(id);
  }
}
