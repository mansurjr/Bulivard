import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { User } from "../users/models/user.model";

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>("SMTP_HOST")!,
      port: Number(this.configService.get<string>("SMTP_PORT")),
      secure: false,
      auth: {
        user: this.configService.get<string>("SMTP_USER")!,
        pass: this.configService.get<string>("SMTP_PASS")!,
      },
    });
  }

  async sendMail(user: User): Promise<void> {
    const activationLink = `${this.configService.get<string>("APP_URL")}/auth/activate/${user.activation_link}`;
    const mailOptions = {
      from: this.configService.get<string>("SMTP_FROM"),
      to: user.email,
      subject: "Activate Your Account - Bulivard",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Hello, ${user.full_name}!</h2>
          <p>Thank you for registering at <strong>Bulivard</strong>.</p>
          <p>Please activate your account by clicking the link below:</p>
          <a href="${activationLink}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Activate Account</a>
          <p style="margin-top: 20px;">If you did not sign up, please ignore this email.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Failed to send activation email:", error);
      throw new ServiceUnavailableException("Failed to send activation email");
    }
  }

  async sendResetMail(user: User): Promise<void> {
    const resetLink = `${this.configService.get<string>("APP_URL")}/auth/reset-password/${user.reset_link}`;
    const mailOptions = {
      from: this.configService.get<string>("SMTP_FROM"),
      to: user.email,
      subject: "Reset Your Password - Bulivard",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password for your account on <strong>Bulivard</strong>.</p>
          <p>Click the link below to set a new password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #dc3545; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p style="margin-top: 20px;">If you did not request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Failed to send reset email:", error);
      throw new ServiceUnavailableException("Failed to send reset email");
    }
  }

  async activatedManager(user: User): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>("SMTP_FROM"),
      to: user.email,
      subject: "Account Activated - Bulivard",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>🎉 Your Account Has Been Activated!</h2>
          <p>Dear <strong>${user.full_name}</strong>,</p>
          <p>Your account on <strong>Bulivard</strong> has been successfully activated.</p>
          <p>You can now log in and start using the platform.</p>
          <br/>
          <p>Thank you for joining us!</p>
          <p>— The Bulivard Team</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new ServiceUnavailableException("Failed to send activation email");
    }
  }

  async notifyAdminsToActivateManager(
    manager: User,
    admins: User[]
  ): Promise<void> {
    const adminEmails = admins.map((admin) => admin.email);
    const adminPanelLink = `${this.configService.get<string>("APP_URL")}/auth/activate-manager/${manager.id}`;

    const mailOptions = {
      from: this.configService.get<string>("SMTP_FROM"),
      to: adminEmails,
      subject: "Manager Activation Required - Bulivard",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>🛂 Manager Activation Needed</h2>
          <p>A new manager <strong>${manager.full_name}</strong> has registered.</p>
          <p>Please review and activate their account:</p>
          <a href="${adminPanelLink}" style="display: inline-block; padding: 10px 20px; background-color: #17a2b8; color: white; text-decoration: none; border-radius: 5px;">Activate Manager</a>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Failed to notify admins:", error);
      throw new ServiceUnavailableException("Failed to notify admins");
    }
  }

  async notifyManagerToActivateReservation(
    manager: User,
    reservation: { id: number; date: Date; details: string }
  ): Promise<void> {
    const activationLink = `${this.configService.get<string>("APP_URL")}/manager/reservation/activate/${reservation.id}`;

    const mailOptions = {
      from: this.configService.get<string>("SMTP_FROM"),
      to: manager.email,
      subject: "Reservation Requires Activation - Bulivard",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>🛎️ Reservation Needs Approval</h2>
          <p>Hello <strong>${manager.full_name}</strong>,</p>
          <p>A new reservation has been created and needs your approval:</p>
          <ul>
            <li><strong>Date:</strong> ${reservation.date}</li>
            <li><strong>Details:</strong> ${reservation.details}</li>
          </ul>
          <p>Please activate the reservation by clicking the button below:</p>
          <a href="${activationLink}" style="display: inline-block; padding: 10px 20px; background-color: #ffc107; color: black; text-decoration: none; border-radius: 5px;">Activate Reservation</a>
          <p>If you have questions, log into the manager dashboard for more information.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(
        "Failed to send reservation activation email to manager:",
        error
      );
      throw new ServiceUnavailableException(
        "Failed to send reservation activation email"
      );
    }
  }
}
