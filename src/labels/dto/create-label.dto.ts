import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLabelDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  color?: string;
}
