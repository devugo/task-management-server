import { Logger } from '@nestjs/common';
import { ThrowError } from '../helpers/throw-error';
import { EntityRepository, Repository } from 'typeorm';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { Project } from './project.entity';
import { User } from '../auth/user.entity';
import { ERROR_CODE } from '../constants/error-code';
import { CreateProjectDto } from './dto/create-project.dto';
import { notFoundErrorMessage } from '../helpers/classes/get-error-message';

const notFoundErr = (id: string): string => notFoundErrorMessage('Label', id);

@EntityRepository(Project)
export class ProjectsRepository extends Repository<Project> {
  private logger = new Logger('LabelsRepository', true);
  async getProjects(
    filterDto: GetProjectsFilterDto,
    user: User,
  ): Promise<Project[]> {
    const { title, description, color } = filterDto;
    const query = this.createQueryBuilder('project');
    query.where({ user });

    if (title) {
      query.andWhere('LOWER(project.title) = LOWER(:title)', { title });
    }
    if (color) {
      query.andWhere('LOWER(project.color) = LOWER(:color)', { color });
    }
    if (description) {
      query.andWhere('(LOWER(project.description) LIKE LOWER(:description))', {
        description: `%${description}%`,
      });
    }

    try {
      const projects = await query.getMany();
      return projects;
    } catch (error) {
      this.logger.error(
        `Failed to get labels for user "${
          user.username
        }". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      ThrowError.internalServer();
    }
  }

  async getById(id: string, user: User): Promise<Project> {
    try {
      const project = await this.findOne({ id, user });

      if (!project) {
        ThrowError.notFound(notFoundErr(id));
      }
      return project;
    } catch (error) {
      if (error.code === ERROR_CODE.internal) {
        ThrowError.notFound(notFoundErr(id));
      }
      throw error;
    }
  }

  async createProject(
    createProjectDto: CreateProjectDto,
    user: User,
  ): Promise<Project> {
    const { title, description, color } = createProjectDto;

    const project = this.create({ title, description, color, user });
    await this.save(project);

    return project;
  }

  async deleteProject(id: string, user: User): Promise<void> {
    try {
      const project = await this.getById(id, user);

      if (project) {
        const result = await this.delete(project);

        if (result.affected === 0) {
          ThrowError.notFound(notFoundErr(id));
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async updateProject(
    id: string,
    createProjectDto: CreateProjectDto,
    user: User,
  ): Promise<Project> {
    const { title, description, color } = createProjectDto;
    try {
      const project = await this.getById(id, user);
      project.title = title;
      project.color = color;
      project.description = description;
      await this.save(project);

      return project;
    } catch (err) {
      throw err;
    }
  }
}
