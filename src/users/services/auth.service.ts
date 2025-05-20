import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword } from 'src/utils';
import { EmailService } from './emailservice';
import { User, UserDocument } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';



@Injectable()
export class AuthService {
  constructor(
    @InjectModel (User.name) private User: Model<UserDocument>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private EmailService: EmailService
  ) {}

async verifyOtp(email: string, otp: string): Promise<string> {
  const user = await this.User.findOne({ email });

  if (!user) {
    throw new BadRequestException('User not found');
  }

  if (user.v_token_exp < new Date()) {
    throw new BadRequestException('OTP expired');
  }

  // Check if user has exceeded allowed attempts
  if (user.v_token_attempts >= 5) {
    user.v_token = undefined;
    user.v_token_exp = undefined;
    await user.save();
    throw new BadRequestException('Too many failed attempts. OTP is now invalid. Resend OTP to get a new one.');
  }

  if (user.v_token !== otp) {
    user.v_token_attempts = (user.v_token_attempts || 0) + 1;
    await user.save();
    throw new BadRequestException('Invalid OTP');
  }

  user.isVerified = true;
  user.v_token = undefined;
  user.v_token_exp = undefined;
  user.v_token_attempts = 0; // reset on success
  await user.save();

  return 'Email verified successfully';
}



async resendOtp(email: string): Promise<string> {
  const user = await this.User.findOne({ email });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (user.isVerified) {
    throw new BadRequestException('User already verified');
  }

  const v_token = Math.floor(100000 + Math.random() * 900000).toString();
  const v_token_exp = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.v_token = v_token;
  user.v_token_exp = v_token_exp;
  user.v_token_attempts = 0; // reset attempts on resend
  await user.save();

  await this.EmailService.sendOtpEmail(user.email, v_token);

  return 'OTP resent successfully';
}




async validateUser(email: string, password: string) {
  const user = await this.usersService.findOne(email);

  if (!user) throw new NotFoundException('Invalid email or password');

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) throw new BadRequestException('Invalid email or password');

  // Check if user is unverified
  if (!user.isVerified) {
    // Generate new OTP
    const v_token = Math.floor(100000 + Math.random() * 900000).toString();
    const v_token_exp = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.v_token = v_token;
    user.v_token_exp = v_token_exp;
    await user.save();

    // Resend OTP
    await this.EmailService.sendOtpEmail(user.email, v_token);

    throw new BadRequestException(`Hello ${user.name}, please verify your email\nCheck your email for verification OTP`);
  }

  return user;
}


  async login(username: string, userId: string) {
    const payload = { username, sub: userId };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(name: string, email: string, password: string) {
    const existingUser = await this.usersService.findOne(email);

    if (existingUser) throw new BadRequestException('Email is already in use.');

    const encryptedPassword = await encryptPassword(password);

    const v_token = Math.floor(Math.random() * 1000000).toString();
    const v_token_exp = new Date(Date.now()+10*60*1000);

    const user = await this.usersService.create({
      email,
      password: encryptedPassword,
      isAdmin: false,
      name,
      isVerified: false,
      v_token,
      v_token_exp,

    });

    // Send OTP via email
    await this.EmailService.sendOtpEmail(user.email, v_token);

    return user;
  }
}


