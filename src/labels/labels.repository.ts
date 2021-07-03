import { Logger } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { ERROR_CODE } from '../constants/error-code';
import { notFoundErrorMessage } from '../helpers/classes/get-error-message';
import { ThrowError } from '../helpers/throw-error';
import { EntityRepository, Repository } from 'typeorm';
import { CreateLabelDto } from './dto/create-label.dto';
import { GetLabelsFilterDto } from './dto/get-labels-filter.dto';
import { Label } from './label.entity';

const notFoundErr = (id: string): string => notFoundErrorMessage('Label', id);

@EntityRepository(Label)
export class LabelsRepository extends Repository<Label> {
  private logger = new Logger('LabelsRepository', true);
  async getLabels(filterDto: GetLabelsFilterDto, user: User): Promise<Label[]> {
    const { title, color } = filterDto;
    const query = this.createQueryBuilder('label');
    query.where({ user });

    if (title) {
      query.andWhere('LOWER(label.title) = LOWER(:title)', { title });
    }
    if (color) {
      query.andWhere('LOWER(label.color) = LOWER(:color)', { color });
    }
    query.orderBy('label.created_at', 'DESC');

    try {
      const labels = await query.getMany();
      return labels;
    } catch (error) {
      this.logger.error(
        `Failed to get labels for user "${
          user.username
        }". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      ThrowError.internalServer();
    }
  }

  async getById(id: string, user: User): Promise<Label> {
    try {
      const label = await this.findOne({ id, user });

      if (!label) {
        ThrowError.notFound(notFoundErr(id));
      }
      return label;
    } catch (error) {
      if (error.code === ERROR_CODE.internal) {
        ThrowError.notFound(notFoundErr(id));
      }
      throw error;
    }
  }

  async createLabel(
    createLabelDto: CreateLabelDto,
    user: User,
  ): Promise<Label> {
    const { title, color } = createLabelDto;

    const label = this.create({ title, color, user });
    await this.save(label);

    return label;
  }

  async deleteLabel(id: string, user: User): Promise<void> {
    try {
      const label = await this.getById(id, user);

      if (label) {
        const result = await this.delete(label);

        if (result.affected === 0) {
          ThrowError.notFound(notFoundErr(id));
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async updateLabel(
    id: string,
    createLabelDto: CreateLabelDto,
    user: User,
  ): Promise<Label> {
    const { title, color } = createLabelDto;
    try {
      const label = await this.getById(id, user);
      label.title = title;
      label.color = color;
      await this.save(label);

      return label;
    } catch (err) {
      throw err;
    }
  }
}
