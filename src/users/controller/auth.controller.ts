// import {
//   Body,
//   Controller,
//   Get,
//   Post,
//   Put,
//   Session,
//   UseGuards,
// } from '@nestjs/common';
// import { CurrentUser } from 'src/decorators/current-user.decorator';
// import { AuthGuard } from 'src/guards/auth.guard';
// import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
// import { LocalAuthGuard } from 'src/guards/local-auth.guard';
// import { Serialize } from 'src/interceptors/serialize.interceptor';
// import { ProfileDto } from '../dtos/profile.dto';
// import { RegisterDto } from '../dtos/register.dto';
// import { UserDto } from '../dtos/user.dto';
// import { UserDocument } from '../schemas/user.schema';
// import { AuthService } from '../services/auth.service';
// import { UsersService } from '../services/users.service';

// @Serialize(UserDto)
// @Controller('auth')
// export class AuthController {
//   constructor(
//     private authService: AuthService,
//     private usersService: UsersService
//   ) {}

//   @UseGuards(LocalAuthGuard)
//   @Post('login')
//   async login(@CurrentUser() user: UserDocument, @Session() session: any) {
//     const { name, _id, email, isAdmin } = user;

//     const { accessToken } = await this.authService.login(name, _id);

//     const loggedUser = { name, _id, isAdmin, email, accessToken };

//     session.user = loggedUser;

//     return loggedUser;
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get('profile')
//   getProfile(@Session() session: any) {
//     return session.user;
//   }

//   @Post('logout')
//   async logout(@Session() session: any) {
//     session.user = null;
//   }

//   @Post('register')
//   async register(
//     @Body() { name, email, password }: RegisterDto,
//     @Session() session: any
//   ) {
//     const user = await this.authService.register(name, email, password);

//     const { _id, isAdmin } = user;

//     const { accessToken } = await this.authService.login(name, user._id);

//     const loggedUser = {
//       name: user.name,
//       _id,
//       isAdmin,
//       email: user.email,
//       accessToken,
//     };

//     session.user = loggedUser;

//     return loggedUser;
//   }

//   @UseGuards(AuthGuard)
//   @Put('profile')
//   async updateUser(@Body() credentials: ProfileDto, @Session() session: any) {
//     const user = await this.usersService.update(session.user._id, credentials);

//     const { name, _id, email, isAdmin } = user;

//     const updatedUser = {
//       name,
//       _id,
//       isAdmin,
//       email,
//       accessToken: session.user.accessToken,
//     };

//     session.user = updatedUser;

//     return updatedUser;
//   }
// }



import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Session,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ProfileDto } from '../dtos/profile.dto';
import { RegisterDto } from '../dtos/register.dto';
import { UserDto } from '../dtos/user.dto';
import { UserDocument } from '../schemas/user.schema';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

@Serialize(UserDto)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

   @Post('verify')
  async verifyOtp(@Body() body: { email: string; otp: string }) {

    const { email, otp } = body;
    await this.authService.verifyOtp(email, otp);
    return {
      message: "verification successfull",
    };
  }



  @Post('resend-otp')
  async resendOtp(@Body('email') email: string) {
    const message = await this.authService.resendOtp(email);
    return { message };

  }



  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: UserDocument, @Session() session: any) {
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { name, _id, email, isAdmin } = user;
    const { accessToken } = await this.authService.login(name, _id.toString());

    const loggedUser = { name, _id, isAdmin, email, accessToken };
    session.user = loggedUser;

    return loggedUser;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Session() session: any) {
    if (!session.user) {
      throw new UnauthorizedException('Not authenticated');
    }
    return session.user;
  }

  @Post('logout')
  async logout(@Session() session: any) {
    session.user = null;
    return { message: 'Logged out successfully' };
  }

  @Post('register')
  async register(
    @Body() { name, email, password }: RegisterDto
  ) {
    const user = await this.authService.register(name, email, password);
    const { _id, isAdmin } = user;
    const { accessToken } = await this.authService.login(name, user._id.toString());

    const loggedUser = {
      name: user.name,
      _id,
      isAdmin,
      email: user.email,
      accessToken,
    };

  }

  @UseGuards(AuthGuard)
  @Put('profile')
  async updateUser(@Body() credentials: ProfileDto, @Session() session: any) {
    if (!session.user) {
      throw new UnauthorizedException('Not authenticated');
    }

    const user = await this.usersService.update(session.user._id, credentials);
    const { name, _id, email, isAdmin } = user;

    const updatedUser = {
      name,
      _id,
      isAdmin,
      email,
      accessToken: session.user.accessToken,
    };
    session.user = updatedUser;

    return updatedUser;
  }
}