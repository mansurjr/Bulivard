import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { MailService } from "../mail/mail.service";
import { SignInDto } from "./dto/signIn-dto";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { ResetPasswordDto } from "./dto/resetPassword-dto";
import { User } from "../users/models/user.model";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import { Request, Response } from "express";
import { UserRoles } from "../common/types/types";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService
  ) {}

  private async generateTokens(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_SECRET,
        expiresIn: process.env.ACCESS_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_SECRET,
        expiresIn: process.env.REFRESH_TIME,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signIn(signInDto: SignInDto, res: Response) {
    const { email, password } = signInDto;

    const user = await this.usersService.findByEmailOrPhone(email);
    if (!user) {
      throw new UnauthorizedException("Password or email is incorrect");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Password or email is incorrect");
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);
    user.token = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      maxAge: +process.env.COOKIE_TIME!,
      httpOnly: true,
    });

    return {
      message: "User logged in successfully",
      accessToken,
    };
  }

  async refresh(req: Request, res: Response) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token not found");
    }

    try {
      const userData = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_SECRET,
      });

      const user = await this.usersService.findOne(userData.id);
      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      const { accessToken, refreshToken: newRefresh } =
        await this.generateTokens(user);

      user.token = newRefresh;
      await user.save();

      res.cookie("refreshToken", newRefresh, {
        maxAge: +process.env.COOKIE_TIME!,
        httpOnly: true,
      });

      return {
        message: "Tokens refreshed successfully",
        accessToken,
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(req: Request, res: Response) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new UnauthorizedException("You are not logged in yet");
    }
    const { id } = this.jwtService.decode(refreshToken) as any;
    const user = await this.usersService.findOne(id);
    user.token = "";
    await user.save();

    res.clearCookie("refreshToken");
    return { message: "User logged out successfully" };
  }

  async signup(
    createUserDto: Omit<CreateUserDto, "role">,
    role: UserRoles
  ): Promise<{ message: string }> {
    const existingUser = await this.usersService.findByEmailOrPhone(
      createUserDto.email
    );
    if (existingUser) {
      throw new ConflictException("Email already registered");
    }
    const { user } = await this.usersService.createUser({
      ...createUserDto,
      role: role,
    });

    try {
      await this.mailService.sendMail(user);
    } catch (error) {
      console.error("Email sending failed:", error);
      throw new ServiceUnavailableException(
        "Failed to send confirmation email"
      );
    }
    let message = "";

    switch (role) {
      case (role = UserRoles.MANAGER):
        this.mailService.notifyAdminsToActivateManager(user, [
          ...(await this.usersService.findAll(UserRoles.ADMIN)),
          ...(await this.usersService.findAll(UserRoles.CREATOR)),
        ]);
        message =
          "You succesfully registered wait till admin activate your account";
        break;
      default:
        message =
          "Successfully registered. Please activate your account via link sent to your email.";
        break;
    }
    return {
      message,
    };
  }

  async activate(activationLink: string) {
    const user = await this.usersService.findByActivationLink(activationLink);
    if (!user) {
      throw new ConflictException("Invalid activation link");
    }

    user.isActive = true;
    await user.save();

    return { message: "Account activated successfully" };
  }

  async activatemanager(id: number) {
    const user = await this.usersService.findManager(id);
    if (!user) {
      throw new ConflictException("Invalid activation link");
    }
    if (user.isActive) {
      throw new ConflictException("Account already activated");
    }
    user.isActive = true;
    await user.save();
    this.mailService.activatedManager(user);
    return { message: "Account activated successfully" };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmailOrPhone(email);
    if (!user) {
      throw new BadRequestException("User not found");
    }

    user.reset_link = uuid.v4();
    await user.save();

    try {
      await this.mailService.sendResetMail(user);
      return { message: "Password reset email sent" };
    } catch (error) {
      console.error("Email sending failed:", error);
      throw new InternalServerErrorException("Failed to send email");
    }
  }

  async resetPassword(resetLink: string, resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByResetLink(resetLink);
    if (!user) {
      throw new BadRequestException("Invalid reset link");
    }

    const { password, confirm_password } = resetPasswordDto;
    if (password !== confirm_password) {
      throw new BadRequestException("Passwords do not match");
    }

    this.usersService.update(user.id, { password });
    user.reset_link = "";
    await user.save();

    return { message: "Password reset successfully" };
  }
  async me(req: Request) {
    const user = await this.usersService.findOne((req as any).user["id"]);
    return user;
  }
}
