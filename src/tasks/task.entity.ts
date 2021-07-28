import { Exclude } from 'class-transformer';
import { User } from '../auth/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @Column({ nullable: true })
  description: string;

  @Column()
  status: TaskStatus;

  @Column()
  date: Date;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;

  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;

  @ManyToOne((_type) => Project, (project) => project.tasks, {
    eager: false,
    onDelete: 'CASCADE',
  })
  project: Project;

  @ManyToOne((_type) => Level, (level) => level.tasks, {
    eager: false,
    cascade: true,
  })
  level: Level;

  @ManyToMany(() => Label, (label) => label.tasks)
  @JoinTable()
  labels: Label[];
}
