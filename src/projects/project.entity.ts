import { Exclude } from 'class-transformer';
import { User } from '../auth/user.entity';
import { Task } from '../tasks/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  color: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany((_type) => Task, (task) => task.project, { eager: true })
  tasks: Task[];

  @ManyToOne((_type) => User, (user) => user.projects, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
