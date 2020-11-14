import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskStatus } from '../enums/task-status.enum';

@Injectable()
export class TaskStatusValidationPipe implements PipeTransform {
  transform(value: UpdateTaskDto, metadata: ArgumentMetadata) {
    if (Object.values(TaskStatus).includes(value.status)) {
      return value;
    }

    throw new BadRequestException(`Status: ${value.status} is invalid`);
  }
}
