import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Reservation } from "./model/reservation.model";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { RestaurantService } from "../restaurant/restaurant.service";
import { SeatService } from "../seat/seat.service";
import { UsersService } from "../users/users.service";
import { MailService } from "../mail/mail.service";
import { Request } from "express";

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation)
    private readonly reservationModel: typeof Reservation,
    private readonly restaurantService: RestaurantService,
    private readonly userService: UsersService,
    private readonly seatService: SeatService,
    private readonly mailService: MailService
  ) {}

  async create(dto: CreateReservationDto): Promise<Reservation> {
    const restaurant = await this.restaurantService.findOne(dto.restaurantId);
    if (!restaurant) {
      throw new NotFoundException("Restaurant not found");
    }

    const user = await this.userService.findOne(dto.customerId);
    if (!user) {
      throw new NotFoundException("Customer (user) not found");
    }

    const seat = await this.seatService.findOne(dto.seatId);
    if (!seat) {
      throw new NotFoundException("Seat not found");
    }

    if (seat.restaurantId !== dto.restaurantId) {
      throw new BadRequestException(
        "Seat does not belong to the specified restaurant"
      );
    }
    const manager = await this.userService.findOne(restaurant.ownerId);

    this.mailService.notifyManagerToActivateReservation(manager, {
      id: restaurant.id,
      date: dto.date,
      details: `${dto.time} - ${dto.guestCount} guests`, 
    });
    return await this.reservationModel.create(dto);
  }

  async findAll(): Promise<Reservation[]> {
    const reservations = await this.reservationModel.findAll();
    if (!reservations.length) {
      throw new NotFoundException("No reservations found");
    }
    return reservations;
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationModel.findByPk(id);
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  async update(id: number, dto: UpdateReservationDto): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (dto.restaurantId && dto.restaurantId !== reservation.restaurantId) {
      await this.restaurantService.findOne(dto.restaurantId);
    }

    if (dto.customerId && dto.customerId !== reservation.customerId) {
      await this.userService.findOne(dto.customerId);
    }

    if (dto.seatId && dto.seatId !== reservation.seatId) {
      const seat = await this.seatService.findOne(dto.seatId);
      if (dto.restaurantId && seat.restaurantId !== dto.restaurantId) {
        throw new BadRequestException(
          "Seat does not belong to the updated restaurant"
        );
      }
    }

    return await reservation.update(dto);
  }

  async remove(id: number): Promise<{ message: string }> {
    const reservation = await this.findOne(id);
    await reservation.destroy();
    return { message: `Reservation with ID ${id} deleted successfully` };
  }
  async checkIn(id: number): Promise<string> {
    const reservation = await this.findOne(id);
    if (reservation.isChecked) {
      throw new BadRequestException("Reservation already checked in");
    }
    reservation.isChecked = true;
    await reservation.save();
    return "Reservation checked in successfully";
  }
 async GetOwnReservations(req: Request & { user?: any }): Promise<Reservation> {
    const userId = req.user.id;
    const reservation = await this.reservationModel.findOne({
      where: {
        customerId: userId,
      },
    });
    if (!reservation) {
      throw new NotFoundException("No active reservation found");
    }
    return reservation;
  }
}
