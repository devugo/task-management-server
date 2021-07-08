import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.do';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { Logger } from '@nestjs/common';
import { UpdateTaskStatusDto } from './dto/update-task-status-dto';
import { RescheduleTaskDto } from './dto/reschedule-task-dto';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private tasksService: TasksService) {}

  @Get('/:type?')
  getTasks(
    @Param('type') type: string,
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filterDto,
      )} and type: ${type}`,
    );
    return this.tasksService.getTasks(type, filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" creating a new task, Data: ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id')
  updateTask(
    @Param('id') id: string,
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${
        user.username
      }" updating a task with id: ${id}, Data: ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.tasksService.updateTask(id, createTaskDto, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${
        user.username
      }" updating a task status with id: ${id}, Data: ${JSON.stringify(
        updateTaskStatusDto,
      )}`,
    );
    return this.tasksService.updateTaskStatus(id, updateTaskStatusDto, user);
  }

  @Patch('/:id/reschedule')
  rescheduleTask(
    @Param('id') id: string,
    @Body() rescheduleTaskDto: RescheduleTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${
        user.username
      }" is rescheduling a task with id: ${id}, Data: ${JSON.stringify(
        rescheduleTaskDto,
      )}`,
    );
    return this.tasksService.rescheduleTask(id, rescheduleTaskDto, user);
  }
}
