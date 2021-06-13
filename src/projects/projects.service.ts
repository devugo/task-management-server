import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { Project } from './project.entity';
import { ProjectsRepository } from './projects.repository';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsRepository)
    private projectsRepository: ProjectsRepository,
  ) {}

  getProjects(filterDto: GetProjectsFilterDto, user: User): Promise<Project[]> {
    return this.projectsRepository.getProjects(filterDto, user);
  }

  getProject(id: string, user: User): Promise<Project> {
    return this.projectsRepository.getById(id, user);
  }

  createProject(
    createProjectDto: CreateProjectDto,
    user: User,
  ): Promise<Project> {
    return this.projectsRepository.createProject(createProjectDto, user);
  }

  deleteProject(id: string, user: User): Promise<void> {
    return this.projectsRepository.deleteProject(id, user);
  }

  updateProject(
    id: string,
    createProjectDto: CreateProjectDto,
    user: User,
  ): Promise<Project> {
    return this.projectsRepository.updateProject(id, createProjectDto, user);
  }
}
