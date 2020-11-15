import { IsNotEmpty } from 'class-validator';
import { User } from '../../auth/entities/user.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
