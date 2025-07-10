import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumberString,
  IsInt,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateMenuDto {
  @ApiProperty({
    example: "Margherita Pizza",
    description: "Name of the menu item",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: "Classic pizza with tomato and cheese",
    description: "Description of the menu item (optional)",
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: "35.000",
    description: "Price of the menu item (as string for formatting)",
  })
  @IsNumberString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({
    example: 1,
    description: "ID of the restaurant this menu item belongs to",
  })
  @IsInt()
  @IsNotEmpty()
  restaurantId: number;
}
