import { IsString, MinLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
  @ApiProperty({
    example: "StrongP@ssw0rd",
    description: "New password (minimum 6 characters)",
  })
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$&*]).*$/, {
    message:
      "Password must contain at least one uppercase letter and one special character",
  })
  password: string;

  @ApiProperty({
    example: "StrongP@ssw0rd",
    description: "Confirm password (must match password)",
  })
  @IsString()
  confirm_password: string;
}
