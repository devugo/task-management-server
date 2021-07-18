import { IsNumber } from 'class-validator';

export class GetTasksSummaryDto {
  @IsNumber()
  today: number;

  @IsNumber()
  due: number;

  @IsNumber()
  upcoming: number;

  @IsNumber()
  open: number;

  @IsNumber()
  inProgress: number;

  @IsNumber()
  completed: number;
}
