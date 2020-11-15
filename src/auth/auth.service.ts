import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './entities/user.entity';
import { IJWTPayload } from './interfaces/jwt-payload.interface';
import { IJwtToken } from './interfaces/jwt-token.interface';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  public async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<IJwtToken> {
    const username = await this.userRepository.signIn(authCredentialsDto);
    if (!username) throw new UnauthorizedException();

    // Create the jwt token
    const payload: IJWTPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  public async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return await this.userRepository.signUp(authCredentialsDto);
  }
}
