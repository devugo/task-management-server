import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabelsRepository } from 'src/labels/labels.repository';
import { LabelsService } from 'src/labels/labels.service';
import { LevelsRepository } from 'src/levels/levels.repository';
import { LevelsService } from 'src/levels/levels.service';
import { ProjectsRepository } from 'src/projects/projects.repository';
import { ProjectsService } from 'src/projects/projects.service';
import { AuthModule } from '../auth/auth.module';
import { CustomController } from './custom.controller';
import { CustomService } from './custom.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LevelsRepository,
      ProjectsRepository,
      LabelsRepository,
    ]),
    AuthModule,
  ],
  controllers: [CustomController],
  providers: [CustomService, LevelsService, ProjectsService, LabelsService],
})
export class CustomModule {}
