import { Logger } from '@nestjs/common';
import { ThrowError } from '../helpers/throw-error';
import { EntityRepository, Repository } from 'typeorm';
import { Level } from './level.entity';
import { notFoundErrorMessage } from 'src/helpers/classes/get-error-message';
import { ERROR_CODE } from 'src/constants/error-code';

const notFoundErr = (id: string): string => notFoundErrorMessage('Level', id);

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

  async getById(id: string): Promise<Level> {
    try {
      const level = await this.findOne({ id });

      if (!level) {
        ThrowError.notFound(notFoundErr(id));
      }
      return level;
    } catch (error) {
      if (error.code === ERROR_CODE.internal) {
        ThrowError.notFound(notFoundErr(id));
      }
      throw error;
    }
  }
}
