import { Module } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelsController } from './levels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelsRepository } from './levels.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([LevelsRepository]), AuthModule],
  providers: [LevelsService],
  controllers: [LevelsController],
})
export class LevelsModule {}
