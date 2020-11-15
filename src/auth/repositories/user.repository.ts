import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);
    // Create a new user
    const user = new User(username, hashedPassword);

    try {
      await user.save();
    } catch (e) {
      if (e.code === '23505') throw new ConflictException();
      throw new InternalServerErrorException();
    }
  }

  public async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    return user && (await bcrypt.compare(password, user.password))
      ? user.username
      : null;
  }
}
