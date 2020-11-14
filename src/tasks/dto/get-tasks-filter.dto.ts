import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn(Object.values(TaskStatus))
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  searchTerm: string;
}
