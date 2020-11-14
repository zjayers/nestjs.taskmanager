import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskRepository } from './repositories/task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  public async getTasks(getTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
    return await this.taskRepository.getAllTasks(getTasksFilterDto);
  }

  public async getTaskById(id: number): Promise<Task> {
    const foundTask = await this.taskRepository.findOne(id);
    if (!foundTask) throw new NotFoundException();
    return foundTask;
  }

  public async createTask({
    title,
    description,
  }: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.createTask(title, description);
  }

  public async updateTask(
    id: number,
    { title, description, status }: UpdateTaskDto,
  ): Promise<Task> {
    const taskToUpdate = await this.getTaskById(id);

    title && (taskToUpdate.title = title);
    description && (taskToUpdate.description = description);
    status && (taskToUpdate.status = status);

    await taskToUpdate.save();

    return taskToUpdate;
  }

  public async deleteTaskById(id: number): Promise<void> {
    const taskToDelete = await this.taskRepository.delete(id);
    if (taskToDelete.affected === 0) throw new NotFoundException();
  }
}
