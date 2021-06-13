import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { Task } from 'src/tasks/task.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Label {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  color: string;

  @ManyToOne((_type) => User, (user) => user.labels, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;

  @ManyToMany(() => Task)
  tasks: Task[];
}
