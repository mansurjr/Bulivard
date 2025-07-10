import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UserRoles } from "../common/types/types";

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  constructor(private readonly userService: UsersService) {}

  async onApplicationBootstrap() {
    const creatorEmail = "ztm008uzb@gmail.com";
    const existing = await this.userService.findByEmailOrPhone(creatorEmail);
    if (!existing) {
      const creatorDto: any = {
        full_name: "Default Creator",
        email: creatorEmail,
        password: "12345678",
        role: UserRoles.CREATOR,
        phone_number: "+996555555555",
        confirm_password: "12345678",
        isActive: true,
      };
      await this.userService.createUser(creatorDto, null);
      console.log("\x1b[33m%s\x1b[0m", "🆕 Creator user created by default.");
    } else {
      console.log("\x1b[36m%s\x1b[0m", "✅ Creator user already exists.");
    }
  }
}
