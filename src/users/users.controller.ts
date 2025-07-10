import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserRoles } from "../common/types/types";
import { Roles } from "../common/decorators/role";
import { RolesGuard } from "../common/guards/role.guard";
import { CustomJwtGuard } from "../common/guards/jwt.guard";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("user")
@UseGuards(CustomJwtGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("admin")
  @Roles("creator")
  @ApiOperation({ summary: "Create an admin user (creator only)" })
  @ApiResponse({ status: 201, description: "Admin created successfully" })
  @ApiResponse({
    status: 409,
    description: "Email or phone number already exists",
  })
  @ApiResponse({ status: 500, description: "Internal server error" })
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser({
      ...createUserDto,
      role: UserRoles.ADMIN,
    });
  }

  @Get()
  @Roles("admin", "creator")
  @ApiOperation({ summary: "Get all users (filterable by role)" })
  @ApiQuery({
    name: "role",
    enum: UserRoles,
    required: false,
    description: "Filter users by role",
  })
  @ApiResponse({
    status: 200,
    description: "List of users returned successfully",
  })
  @ApiResponse({ status: 400, description: "Invalid role query" })
  findAll(@Query("role") role?: UserRoles) {
    return this.usersService.findAll(role);
  }

  @Get(":id")
  @Roles("admin", "creator")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "User found successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @Roles("creator")
  @ApiOperation({ summary: "Update user (creator only)" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "User updated successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @Roles("creator")
  @ApiOperation({ summary: "Delete user (creator only)" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
