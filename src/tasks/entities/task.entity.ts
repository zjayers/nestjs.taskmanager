import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { TaskStatus } from '../enums/task-status.enum';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 100 })
  description: string;

  @Column({ type: 'enum', enum: TaskStatus })
  status: TaskStatus;

  @Exclude()
  @ManyToOne(() => User, (user) => user.tasks, { eager: false })
  user: User;

  @Exclude()
  @Column()
  userId: number;

  constructor(title, description, user) {
    super();
    this.title = title;
    this.description = description;
    this.user = user;
    this.status = TaskStatus.OPEN;
  }
}
