import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabelsRepository } from 'src/labels/labels.repository';
import { LabelsService } from 'src/labels/labels.service';
import { LevelsRepository } from 'src/levels/levels.repository';
import { LevelsService } from 'src/levels/levels.service';
import { ProjectsRepository } from 'src/projects/projects.repository';
import { ProjectsService } from 'src/projects/projects.service';
import { AuthModule } from '../auth/auth.module';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TasksRepository,
      LevelsRepository,
      ProjectsRepository,
      LabelsRepository,
    ]),
    AuthModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, LevelsService, ProjectsService, LabelsService],
})
export class TasksModule {}
