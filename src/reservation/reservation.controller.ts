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
  Req,
} from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { CustomJwtGuard } from "../common/guards/jwt.guard";
import { RolesGuard } from "../common/guards/role.guard";
import { Roles } from "../common/decorators/role";
import { Request } from "express";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { Reservation } from "./model/reservation.model";

@ApiTags("Reservations")
@ApiBearerAuth()
@Controller("reservation")
@UseGuards(CustomJwtGuard, RolesGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @Roles("customer", "manager")
  @ApiOperation({ summary: "Create a reservation" })
  @ApiResponse({
    status: 201,
    description: "Reservation created",
    type: Reservation,
  })
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  @Roles("admin", "manager")
  @ApiOperation({ summary: "Get all reservations" })
  @ApiResponse({
    status: 200,
    description: "List of all reservations",
    type: [Reservation],
  })
  findAll() {
    return this.reservationService.findAll();
  }

  @Get("my")
  @Roles("customer", "manager", "admin")
  @ApiOperation({ summary: "Get current user's reservation" })
  @ApiResponse({
    status: 200,
    description: "Current user's reservation",
    type: Reservation,
  })
  getMyReservations(@Req() req: Request) {
    return this.reservationService.GetOwnReservations(req);
  }

  @Get(":id")
  @Roles("admin", "manager")
  @ApiOperation({ summary: "Get reservation by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({
    status: 200,
    description: "Reservation found",
    type: Reservation,
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.reservationService.findOne(id);
  }

  @Patch(":id")
  @Roles("admin", "manager")
  @ApiOperation({ summary: "Update a reservation by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({
    status: 200,
    description: "Reservation updated",
    type: Reservation,
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateReservationDto: UpdateReservationDto
  ) {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(":id")
  @Roles("admin")
  @ApiOperation({ summary: "Delete a reservation by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Reservation deleted" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.reservationService.remove(id);
  }

  @Get("activate/:id")
  @Roles("manager")
  @ApiOperation({ summary: "Check-in (activate) reservation by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Reservation activated" })
  activateReservation(@Param("id", ParseIntPipe) id: number) {
    return this.reservationService.checkIn(id);
  }
}
