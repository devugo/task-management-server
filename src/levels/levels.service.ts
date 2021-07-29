import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Level } from './level.entity';
import { LevelsRepository } from './levels.repository';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(LevelsRepository)
    private levelsRepository: LevelsRepository,
  ) {}

  async getLevels(): Promise<Level[]> {
    return this.levelsRepository.getLevels();
  }

  async getLevelById(id: string): Promise<Level> {
    return this.levelsRepository.getById(id);
  }
}
