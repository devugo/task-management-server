import { IsNotEmpty, IsOptional } from 'class-validator';
import { Label } from 'src/labels/label.entity';
import { Level } from 'src/levels/level.entity';
import { Project } from 'src/projects/project.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  date?: Date;

  @IsOptional()
  description?: string;

  @IsOptional()
  labels?: string | Label[];

  @IsOptional()
  project?: string | Project;

  @IsOptional()
  level?: string | Level;
}
