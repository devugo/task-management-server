import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { Project } from './project.entity';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(AuthGuard())
export class ProjectsController {
  private logger = new Logger('ProjectsController');
  constructor(private projectsService: ProjectsService) {}

  @Get()
  getProjects(
    @Query() filterDto: GetProjectsFilterDto,
    @GetUser() user: User,
  ): Promise<Project[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.projectsService.getProjects(filterDto, user);
  }

  @Get('/:id')
  getProject(@Param('id') id: string, @GetUser() user: User): Promise<Project> {
    return this.projectsService.getProject(id, user);
  }

  @Post()
  createProject(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: User,
  ): Promise<Project> {
    return this.projectsService.createProject(createProjectDto, user);
  }

  @Delete('/:id')
  deleteProject(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.projectsService.deleteProject(id, user);
  }

  @Patch('/:id')
  updateProject(
    @Param('id') id: string,
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: User,
  ): Promise<Project> {
    return this.projectsService.updateProject(id, createProjectDto, user);
  }
}
