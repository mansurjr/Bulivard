import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsIn,
  IsPhoneNumber,
  Matches,
  IsLongitude,
  IsLatitude,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateRestaurantDto {
  @ApiProperty({ example: "Burger House", description: "Restaurant name" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: "Best burgers in town",
    description: "Description of the restaurant",
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: 1, description: "Owner user ID" })
  @IsInt()
  @IsNotEmpty()
  ownerId: number;

  @ApiProperty({ example: "09:00", description: "Opening time (HH:mm)" })
  @Matches(/^\d{2}:\d{2}$/, { message: "Invalid time format. Use HH:mm" })
  @IsString()
  @IsNotEmpty()
  openTime: string;

  @ApiProperty({ example: "22:00", description: "Closing time (HH:mm)" })
  @Matches(/^\d{2}:\d{2}$/, { message: "Invalid time format. Use HH:mm" })
  @IsString()
  @IsNotEmpty()
  closeTime: string;

  @ApiProperty({
    example: 4,
    description: "Rating (1 to 5)",
    enum: [1, 2, 3, 4, 5],
  })
  @IsInt()
  @IsIn([1, 2, 3, 4, 5])
  rating: number;

  @ApiPropertyOptional({
    example: "@burgerhouse_uz",
    description: "Social media handle",
  })
  @IsString()
  @IsOptional()
  social: string;

  @ApiPropertyOptional({
    example: "+998901234567",
    description: "Contact phone number (Uzbekistan)",
  })
  @IsPhoneNumber("UZ")
  @IsOptional()
  contact: string;

  @ApiProperty({
    example: "Tashkent, Amir Temur Street",
    description: "Physical address",
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: "69.2401", description: "Longitude" })
  @IsString()
  @IsLongitude()
  @IsNotEmpty()
  long: string;

  @ApiProperty({ example: "41.3111", description: "Latitude" })
  @IsString()
  @IsLatitude()
  @IsNotEmpty()
  lat: string;
}
