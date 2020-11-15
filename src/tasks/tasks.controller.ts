import {
  Patch,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private tasksService: TasksService) {}

  @Get()
  public async getTasks(
    @Query(ValidationPipe)
    filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}"retrieving all tasks`);
    this.logger.warn(`Filters: ${JSON.stringify(filterDto)}`);
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  public async getOneTask(
    @Param('id', ParseIntPipe)
    id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Patch('/:id')
  public async updateOneTask(
    @Param('id', ParseIntPipe) id: number,
    @Body(TaskStatusValidationPipe) updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  public async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  public async deleteOneTask(
    @Param('id', ParseIntPipe)
    id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteTaskById(id, user);
  }
}
