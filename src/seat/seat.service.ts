import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Seat } from "./model/seat.model";
import { CreateSeatDto } from "./dto/create-seat.dto";
import { UpdateSeatDto } from "./dto/update-seat.dto";
import { RestaurantService } from "../restaurant/restaurant.service";
import { Op } from "sequelize";
import { Reservation } from "../reservation/model/reservation.model";

@Injectable()
export class SeatService {
  constructor(
    @InjectModel(Seat)
    private readonly seatModel: typeof Seat,
    private readonly restaurantService: RestaurantService,
    @InjectModel(Reservation)
    private readonly ReservaationModel: typeof Reservation
  ) {}

  async create(createSeatDto: CreateSeatDto): Promise<Seat> {
    const restaurant = await this.restaurantService.findOne(
      createSeatDto.restaurantId
    );
    if (!restaurant) {
      throw new NotFoundException(`Restaurant not found`);
    }
    return await this.seatModel.create(createSeatDto);
  }

  async findAll(): Promise<Seat[]> {
    const seats = await this.seatModel.findAll();
    if (!seats.length) {
      throw new NotFoundException("No seats found");
    }
    return seats;
  }

  async findOne(id: number): Promise<Seat> {
    const seat = await this.seatModel.findByPk(id);
    if (!seat) {
      throw new NotFoundException(`Seat not found`);
    }
    return seat;
  }

  async update(id: number, updateSeatDto: UpdateSeatDto): Promise<Seat> {
    const seat = await this.findOne(id);

    if (
      updateSeatDto.restaurantId &&
      updateSeatDto.restaurantId !== seat.restaurantId
    ) {
      await this.restaurantService.findOne(updateSeatDto.restaurantId);
    }

    return await seat.update({
      ...updateSeatDto,
    });
  }

  async remove(id: number): Promise<{ message: string }> {
    const seat = await this.findOne(id);
    await seat.destroy();
    return { message: `Seat deleted successfully` };
  }
  async getFreeSeats(restaurantId: number, date: string, time: string) {
    const reservedSeats = await this.ReservaationModel.findAll({
      where: { date, time },
      attributes: ["seatId"],
    });

    const reservedSeatIds = reservedSeats.map((r) => r.seatId);

    const freeSeats = await this.seatModel.findAll({
      where: {
        restaurantId,
        id: {
          [Op.notIn]: reservedSeatIds.length > 0 ? reservedSeatIds : [0],
        },
      },
    });

    return freeSeats;
  }
}
