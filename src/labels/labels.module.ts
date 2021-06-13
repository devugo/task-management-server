import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { LabelsController } from './labels.controller';
import { LabelsRepository } from './labels.repository';
import { LabelsService } from './labels.service';

@Module({
  imports: [TypeOrmModule.forFeature([LabelsRepository]), AuthModule],
  controllers: [LabelsController],
  providers: [LabelsService],
})
export class LabelsModule {}
