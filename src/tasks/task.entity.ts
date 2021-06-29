import { Exclude } from 'class-transformer';
import { User } from '../auth/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { Label } from '../labels/label.entity';
import { Project } from '../projects/project.entity';
import { Level } from '../levels/level.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;

  @ManyToOne((_type) => Project, (project) => project.tasks, { eager: false })
  project: Project;

  @ManyToOne((_type) => Level, (level) => level.tasks, { eager: false })
  level: Level;

  @ManyToMany(() => Label)
  @JoinTable()
  labels: Label[];
}
