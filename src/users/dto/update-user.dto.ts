import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { UserRoles } from "../../common/types/types";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ description: "Optional new full name" })
  full_name?: string;

  @ApiPropertyOptional({ description: "Optional new email" })
  email?: string;

  @ApiPropertyOptional({ description: "Optional new phone number" })
  phone_number?: string;

  @ApiPropertyOptional({ description: "Optional new password" })
  password?: string;

  @ApiPropertyOptional({ description: "Optional new role" })
  role?: UserRoles;

  @ApiPropertyOptional({ description: "Optional password confirmation" })
  confirm_password?: string;
}
