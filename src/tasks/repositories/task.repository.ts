import { EntityRepository, Repository } from 'typeorm';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';
import { Task } from '../entities/task.entity';

const STATUS_MATCH_QUERY = 'task.status = :status';
const TITLE_CONTAINS_QUERY = 'task.title LIKE :searchTerm';
const DESCRIPTION_CONTAINS_QUERY = 'task.description LIKE :searchTerm';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  public async createTask(title: string, description: string): Promise<Task> {
    const task = new Task(title, description);
    await task.save();
    return task;
  }

  public async getAllTasks({
    status,
    searchTerm,
  }: GetTasksFilterDto): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    status && query.andWhere(STATUS_MATCH_QUERY, { status });
    searchTerm &&
      query.andWhere(
        `${TITLE_CONTAINS_QUERY} OR ${DESCRIPTION_CONTAINS_QUERY}`,
        { searchTerm: `%${searchTerm}%` },
      );

    return await query.getMany();
  }
}
