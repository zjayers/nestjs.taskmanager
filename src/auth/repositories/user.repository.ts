import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { User } from '../entities/user.entity';
import bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    // Generate a unique salt per user
    const salt = await bcrypt.genSalt();
    // Hash the password
    const hashedPassword = await this.hashPassword(password, salt);
    // Create a new user
    const user = new User(username, hashedPassword, salt);

    try {
      await user.save();
    } catch (e) {
      if (e.code === '23505') throw new ConflictException();
      throw new InternalServerErrorException();
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
