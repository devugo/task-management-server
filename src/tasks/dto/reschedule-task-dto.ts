import { IsNotEmpty } from 'class-validator';

export class RescheduleTaskDto {
  @IsNotEmpty()
  date: Date;
}
