import { IsOptional, IsString } from 'class-validator';

export class GetLabelsFilterDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  color?: string;
}
