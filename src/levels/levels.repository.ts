import { Logger } from '@nestjs/common';
import { ThrowError } from '../helpers/throw-error';
import { EntityRepository, Repository } from 'typeorm';
import { Level } from './level.entity';

@EntityRepository(Level)
export class LevelsRepository extends Repository<Level> {
  private logger = new Logger('LevelsRepository', true);
  async getLevels(): Promise<Level[]> {
    try {
      const levels = this.find();
      return levels;
    } catch (error) {
      this.logger.error(`Failed to get levels`, error.stack);
      ThrowError.internalServer();
    }
  }
}
