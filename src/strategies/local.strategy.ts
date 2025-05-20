import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../users/services/auth.service';
import { User } from '../users/schemas/user.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', 
      //passport super constructor expects username to be named email (default value is username)
      //and password to be named password as default
    });
  }



  //built in method
  async validate(email: string, password: string): Promise<User> {   //if a valid user: return user ; or throw error
    const user = await this.authService.validateUser(email, password);

    return user;
  }
}
