import {
  IsInt,
  IsNotEmpty,
  IsDateString,
  Matches,
  Min,
  Max,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateReservationDto {
  @ApiProperty({ example: 1, description: "Seat ID to reserve" })
  @IsInt()
  @IsNotEmpty()
  seatId: number;

  @ApiProperty({
    example: 1,
    description: "Restaurant ID where the seat belongs",
  })
  @IsInt()
  @IsNotEmpty()
  restaurantId: number;

  @ApiProperty({
    example: 5,
    description: "Customer (user) ID making the reservation",
  })
  @IsInt()
  @IsNotEmpty()
  customerId: number;

  @ApiProperty({
    example: "2025-07-20",
    description: "Reservation date (YYYY-MM-DD)",
  })
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    example: "18:30",
    description: "Reservation time in HH:mm format",
  })
  @Matches(/^\d{2}:\d{2}$/, {
    message: "Time must be in HH:mm format (e.g. 14:30)",
  })
  @IsNotEmpty()
  time: string;

  @ApiProperty({
    example: 4,
    minimum: 1,
    maximum: 100,
    description: "Number of guests",
  })
  @IsInt()
  @Min(1)
  @Max(100)
  guestCount: number;
}
