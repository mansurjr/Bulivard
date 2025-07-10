import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/signIn-dto";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { ResetPasswordDto } from "./dto/resetPassword-dto";
import { Request, Response } from "express";
import { UserRoles } from "../common/types/types";
import { CustomJwtGuard } from "../common/guards/jwt.guard";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup/customer")
  @ApiOperation({ summary: "Sign up as Customer" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: "Customer registered successfully" })
  signupccustomer(@Body() createUserDto: Omit<CreateUserDto, "role">) {
    return this.authService.signup(createUserDto, UserRoles.CUSTOMER);
  }

  @Post("signup/manager")
  @ApiOperation({ summary: "Sign up as Manager" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: "Manager registered successfully" })
  signupManager(@Body() createUserDto: Omit<CreateUserDto, "role">) {
    return this.authService.signup(createUserDto, UserRoles.MANAGER);
  }

  @Post("signin")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Sign in" })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 200, description: "User signed in successfully" })
  signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signIn(signInDto, res);
  }

  @Get("activate/:link")
  @ApiOperation({ summary: "Activate account with activation link" })
  @ApiParam({ name: "link", description: "Activation link (UUID)" })
  @ApiResponse({ status: 200, description: "Account activated successfully" })
  activate(@Param("link") activationLink: string) {
    return this.authService.activate(activationLink);
  }

  @Get("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh access token" })
  @ApiResponse({ status: 200, description: "Tokens refreshed" })
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(req, res);
  }

  @Get("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Logout and clear refresh token" })
  @ApiResponse({ status: 200, description: "User logged out" })
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res);
  }

  @Post("forgot-password")
  @ApiOperation({ summary: "Send reset password link to email" })
  @ApiBody({ schema: { example: { email: "user@example.com" } } })
  @ApiResponse({ status: 200, description: "Reset email sent" })
  forgotPassword(@Body("email") email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post("reset-password/:link")
  @ApiOperation({ summary: "Reset password using reset link" })
  @ApiParam({ name: "link", description: "Reset token (UUID)" })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: "Password reset successfully" })
  resetPassword(
    @Param("link") resetLink: string,
    @Body() resetPasswordDto: ResetPasswordDto
  ) {
    return this.authService.resetPassword(resetLink, resetPasswordDto);
  }

  @Get("activate-manager/:id")
  @ApiOperation({ summary: "Activate a manager account (by admin)" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Manager activated successfully" })
  activatemanager(@Param("id") id: number) {
    return this.authService.activatemanager(id);
  }

  @UseGuards(CustomJwtGuard)
  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user (by token)" })
  @ApiResponse({ status: 200, description: "Current user info" })
  me(@Req() req: Request) {
    return this.authService.me(req);
  }
}
