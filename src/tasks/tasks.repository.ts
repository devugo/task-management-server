import { User } from '../auth/user.entity';
import {
  EntityRepository,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.do';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { Logger } from '@nestjs/common';
import { ThrowError } from '../helpers/throw-error';
import { ERROR_CODE } from '../constants/error-code';
import { notFoundErrorMessage } from '../helpers/classes/get-error-message';
import { UpdateTaskStatusDto } from './dto/update-task-status-dto';
import { RescheduleTaskDto } from './dto/reschedule-task-dto';
import { PAGINATION } from 'src/constants/pagination';
const moment = require('moment');

const notFoundErr = (id: string): string => notFoundErrorMessage('Task', id);

const dateWithoutTime = moment(new Date()).format('YYYY-MM-DD');
const startDate = moment(dateWithoutTime).format('YYYY-MM-DD HH:mm:ss');
const endDate = `${dateWithoutTime} 23:59:59`;

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository', true);
  async getTasks(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<{ tasks: Task[]; count: number }> {
    const { type, status, search, start, end, project, level, label, page } =
      filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (start && end) {
      query.andWhere('task.date BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    }

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (type === 'today') {
      query.andWhere('(task.date >= :start AND task.date <= :end)', {
        start: startDate,
        end: endDate,
      });
    }

    if (project) {
      query.andWhere('task.projectId = :project', {
        project,
      });
    }

    if (level) {
      query.andWhere('task.levelId = :level', {
        level,
      });
    }

    if (label) {
      query
        .innerJoinAndSelect('task.labels', 'label')
        .andWhere('task_label.labelId = :label', { label });
    } else {
      query.leftJoinAndSelect('task.labels', 'label');
    }

    if (type === 'overdue') {
      query.andWhere(
        '(task.date < :date AND (task.status = :status1 OR task.status = :status2))',
        {
          date: startDate,
          status1: 'IN_PROGRESS',
          status2: 'OPEN',
        },
      );
    }

    if (type === 'upcoming') {
      query.andWhere('task.date > :date', {
        date: endDate,
      });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (page) {
      query.skip(PAGINATION.itemsPerPage * (parseInt(page) - 1));
    }

    query.leftJoinAndSelect('task.level', 'level');
    query.leftJoinAndSelect('task.project', 'project');
    query.orderBy('task.created_at', 'DESC');

    // .skip(5)
    // .take(10)

    try {
      const count = await query.getCount();
      const tasks = await query.take(PAGINATION.itemsPerPage).getMany();
      return { tasks, count };
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
      const task = await this.findOne({
        relations: ['labels', 'project', 'level'],
        where: { id, user },
      });

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

  async rescheduleTask(
    id: string,
    rescheduleTaskDto: RescheduleTaskDto,
    user: User,
  ): Promise<Task> {
    const { date } = rescheduleTaskDto;

    try {
      const task = await this.getById(id, user);
      task.date = date;
      await this.save(task);

      return task;
    } catch (err) {
      throw err;
    }
  }
}
