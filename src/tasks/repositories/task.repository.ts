import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';
import { Task } from '../entities/task.entity';

const STATUS_MATCH_QUERY = 'task.status = :status';
const TITLE_CONTAINS_QUERY = 'task.title LIKE :searchTerm';
const DESCRIPTION_CONTAINS_QUERY = 'task.description LIKE :searchTerm';
const USERID_MATCH_QUERY = 'task.userId = :userId';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  public async createTask(
    title: string,
    description: string,
    user: User,
  ): Promise<Task> {
    const task = new Task(title, description, user);
    await task.save();
    return task;
  }

  public async getAllTasks(
    { status, searchTerm }: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    query.where(USERID_MATCH_QUERY, { userId: user.id });
    status && query.andWhere(STATUS_MATCH_QUERY, { status });
    searchTerm &&
      query.andWhere(
        `${TITLE_CONTAINS_QUERY} OR ${DESCRIPTION_CONTAINS_QUERY}`,
        { searchTerm: `%${searchTerm}%` },
      );

    return await query.getMany();
  }
}
