import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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

  constructor(title, description) {
    super();
    this.title = title;
    this.description = description;
    this.status = TaskStatus.OPEN;
  }
}
