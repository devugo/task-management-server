import { Injectable } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { LevelsService } from 'src/levels/levels.service';
import { ProjectsService } from 'src/projects/projects.service';
import { LabelsService } from 'src/labels/labels.service';
import { Label } from 'src/labels/label.entity';
import { Project } from 'src/projects/project.entity';
import { Level } from 'src/levels/level.entity';

@Injectable()
export class CustomService {
  constructor(
    private levelsService: LevelsService,
    private projectsService: ProjectsService,
    private labelsService: LabelsService,
  ) {}

  async getStarterData(user: User): Promise<{
    labels: Label[];
    projects: Project[];
    levels: Level[];
  }> {
    const levels = await this.levelsService.getLevels();
    const projects = await this.projectsService.getProjects({}, user);
    const labels = await this.labelsService.getLabels({}, user);
    return { labels, projects, levels };
  }
}
