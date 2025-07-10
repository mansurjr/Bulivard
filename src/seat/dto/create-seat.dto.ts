import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsPositive,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSeatDto {
  @ApiProperty({
    example: 4,
    description: "Number of people the seat can accommodate",
  })
  @IsPositive()
  @IsNotEmpty()
  capacity: number;

  @ApiProperty({
    example: "25000",
    description: "Price of the seat in string format (for consistency)",
  })
  @IsNumberString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({
    example: true,
    description: "Indicates if the seat is a VIP seat",
  })
  @IsBoolean()
  @IsNotEmpty()
  IsVip: boolean;

  @ApiProperty({
    example: 1,
    description: "ID of the restaurant this seat belongs to",
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  restaurantId: number;
}
