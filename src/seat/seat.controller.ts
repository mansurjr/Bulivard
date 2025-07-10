import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { SeatService } from "./seat.service";
import { CreateSeatDto } from "./dto/create-seat.dto";
import { UpdateSeatDto } from "./dto/update-seat.dto";
import { Roles } from "../common/decorators/role";
import { CustomJwtGuard } from "../common/guards/jwt.guard";
import { RolesGuard } from "../common/guards/role.guard";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

@ApiTags("Seats")
@ApiBearerAuth()
@Controller("seat")
@UseGuards(CustomJwtGuard, RolesGuard)
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Post()
  @Roles("admin", "manager")
  @ApiOperation({ summary: "Create a new seat (admin/manager only)" })
  create(@Body() createSeatDto: CreateSeatDto) {
    return this.seatService.create(createSeatDto);
  }

  @Get()
  @Roles("admin", "manager")
  @ApiOperation({ summary: "Get all seats (admin/manager only)" })
  findAll() {
    return this.seatService.findAll();
  }

  @Get(":id")
  @Roles("admin", "manager")
  @ApiOperation({ summary: "Get seat by ID (admin/manager only)" })
  @ApiParam({ name: "id", type: Number, description: "Seat ID" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.seatService.findOne(id);
  }

  @Patch(":id")
  @Roles("admin", "manager")
  @ApiOperation({ summary: "Update seat by ID (admin/manager only)" })
  @ApiParam({ name: "id", type: Number, description: "Seat ID" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateSeatDto: UpdateSeatDto
  ) {
    return this.seatService.update(id, updateSeatDto);
  }

  @Delete(":id")
  @Roles("admin", "manager")
  @ApiOperation({ summary: "Delete seat by ID (admin/manager only)" })
  @ApiParam({ name: "id", type: Number, description: "Seat ID" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.seatService.remove(id);
  }

  @Get("/free/list/:restaurantId")
  @Roles("admin", "manager", "customer")
  @ApiOperation({
    summary:
      "Get list of available (not reserved) seats in a restaurant for a specific date and time",
  })
  @ApiParam({
    name: "restaurantId",
    type: Number,
    description: "ID of the restaurant",
  })
  @ApiQuery({
    name: "date",
    required: true,
    description: "Date in format YYYY-MM-DD",
    example: "2025-07-10",
  })
  @ApiQuery({
    name: "time",
    required: true,
    description: "Time in format HH:mm",
    example: "18:00",
  })
  getFreeSeats(
    @Param("restaurantId", ParseIntPipe) restaurantId: number,
    @Query("date") date: string,
    @Query("time") time: string
  ) {
    return this.seatService.getFreeSeats(restaurantId, date, time);
  }
}
