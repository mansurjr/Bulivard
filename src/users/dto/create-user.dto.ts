import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserRoles } from "../../common/types/types";

export class CreateUserDto {
  @ApiProperty({ example: "John Doe", description: "Full name of the user" })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: "john@example.com", description: "User email" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "+998901234567", description: "User phone number" })
  @IsPhoneNumber("UZ")
  phone_number: string;

  @ApiProperty({ example: "securepassword123", description: "User password" })
  @IsString()
  password: string;

  @ApiProperty({
    enum: UserRoles,
    required: false,
    description: "Optional user role (admin/manager/user)",
  })
  @IsOptional()
  role?: UserRoles;

  @ApiProperty({
    example: "securepassword123",
    description: "Password confirmation",
  })
  @IsString()
  confirm_password: string;
}
