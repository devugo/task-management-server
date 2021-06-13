import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { Task } from 'src/tasks/task.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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

  @OneToMany((_type) => Task, (task) => task.project, { eager: true })
  tasks: Task[];

  @ManyToOne((_type) => User, (user) => user.projects, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
