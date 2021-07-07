import { User } from '../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.do';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { Logger } from '@nestjs/common';
import { ThrowError } from '../helpers/throw-error';
import { ERROR_CODE } from '../constants/error-code';
import { notFoundErrorMessage } from '../helpers/classes/get-error-message';
import { UpdateTaskStatusDto } from './dto/update-task-status-dto';

const notFoundErr = (id: string): string => notFoundErrorMessage('Task', id);

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository', true);
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search, start, end } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (start && end) {
      query.andWhere('task.created_at BETWEEN :start AND :end', { start, end });
    }

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    query.leftJoinAndSelect('task.level', 'level');
    query.leftJoinAndSelect('task.project', 'project');
    query.leftJoinAndSelect('task.labels', 'label');
    query.orderBy('task.created_at', 'DESC');

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (err) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }". Filters: ${JSON.stringify(filterDto)}`,
        err.stack,
      );
      ThrowError.internalServer();
    }
  }

  async getById(id: string, user: User): Promise<Task> {
    try {
      const task = await this.findOne({ id, user });

      if (!task) {
        ThrowError.notFound(notFoundErr(id));
      }
      return task;
    } catch (error) {
      if (error.code === ERROR_CODE.internal) {
        ThrowError.notFound(notFoundErr(id));
      }
      throw error;
    }
  }

  async createTask(createTaskDto: any, user: User): Promise<Task> {
    const { title, description, level, project, labels, date } = createTaskDto;

    const task = this.create({
      title,
      description,
      level,
      project,
      labels,
      status: TaskStatus.OPEN,
      date,
      user,
    });
    await this.save(task);

    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    try {
      const task = await this.getById(id, user);

      if (task) {
        await this.remove(task);
      }
    } catch (error) {
      if (error.code === ERROR_CODE.internal) {
        ThrowError.notFound(notFoundErr(id));
      }
      throw error;
    }
  }

  async updateTask(id: string, createTaskDto: any, user: User): Promise<Task> {
    const { title, description, level, project, labels, date } = createTaskDto;
    console.log('Update date', date);
    try {
      const task = await this.getById(id, user);
      task.title = title;
      task.description = description;
      task.level = level;
      task.project = project;
      task.labels = labels;
      task.date = date;
      await this.save(task);

      return task;
    } catch (err) {
      throw err;
    }
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;

    try {
      const task = await this.getById(id, user);
      task.status = status;
      await this.save(task);

      return task;
    } catch (err) {
      throw err;
    }
  }
}
