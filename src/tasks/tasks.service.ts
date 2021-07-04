import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.do';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';
import { LevelsService } from 'src/levels/levels.service';
import { ProjectsService } from 'src/projects/projects.service';
import { LabelsService } from 'src/labels/labels.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
    private levelsService: LevelsService,
    private projectsService: ProjectsService,
    private labelsService: LabelsService,
  ) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    return this.tasksRepository.getById(id, user);
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description, level, project, labels } = createTaskDto;
    const sendData = { title, description } as CreateTaskDto;

    if (level) {
      const exist = await this.levelsService.getLevelById(level as string);

      if (exist) {
        sendData.level = exist;
      }
    }

    if (project) {
      const exist = await this.projectsService.getProjectById(
        project as string,
        user,
      );

      if (exist) {
        sendData.project = exist;
      }
    }

    if (labels) {
      let labelsArray;
      // Parse to array if in string format.
      if (typeof labels === 'string') {
        labelsArray = JSON.parse(labels as string);
      } else {
        labelsArray = labels;
      }

      if (labelsArray.length > 0) {
        const labelsExist = [];
        for (let i = 0; i < labelsArray.length; i++) {
          const label = labelsArray[i];
          const exist = await this.labelsService.getLabelById(
            label as string,
            user,
          );

          if (exist) {
            labelsExist.push(exist);
          }
        }
        sendData.labels = labelsExist;
      }
    }

    return this.tasksRepository.createTask(sendData, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    return this.tasksRepository.deleteTask(id, user);
  }

  async updateTask(
    id: string,
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const { title, description, level, project, labels } = createTaskDto;
    const sendData = { title, description } as CreateTaskDto;
    if (level) {
      const exist = await this.levelsService.getLevelById(level as string);

      if (exist) {
        sendData.level = exist;
      }
    }

    if (project) {
      const exist = await this.projectsService.getProjectById(
        project as string,
        user,
      );

      if (exist) {
        sendData.project = exist;
      }
    }

    if (labels) {
      let labelsArray;
      // Parse to array if in string format.
      if (typeof labels === 'string') {
        labelsArray = JSON.parse(labels as string);
      } else {
        labelsArray = labels;
      }

      if (labelsArray.length > 0) {
        const labelsExist = [];
        for (let i = 0; i < labelsArray.length; i++) {
          const label = labelsArray[i];
          const exist = await this.labelsService.getLabelById(
            label as string,
            user,
          );

          if (exist) {
            labelsExist.push(exist);
          }
        }
        sendData.labels = labelsExist;
      }
    }

    return this.tasksRepository.updateTask(id, sendData, user);
  }
}
