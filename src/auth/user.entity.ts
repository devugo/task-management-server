import { Task } from '../tasks/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Label } from '../labels/label.entity';
import { Project } from '../projects/project.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  @OneToMany((_type) => Label, (label) => label.user, { eager: true })
  labels: Label[];

  @OneToMany((_type) => Project, (project) => project.user, { eager: true })
  projects: Project[];
}
