import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { CreateLabelDto } from './dto/create-label.dto';
import { GetLabelsFilterDto } from './dto/get-labels-filter.dto';
import { Label } from './label.entity';
import { LabelsRepository } from './labels.repository';

@Injectable()
export class LabelsService {
  constructor(
    @InjectRepository(LabelsRepository)
    private labelsRepository: LabelsRepository,
  ) {}

  getLabels(filterDto: GetLabelsFilterDto, user: User): Promise<Label[]> {
    return this.labelsRepository.getLabels(filterDto, user);
  }

  getLabel(id: string, user: User): Promise<Label> {
    return this.labelsRepository.getById(id, user);
  }

  createLabel(createLabelDto: CreateLabelDto, user: User): Promise<Label> {
    return this.labelsRepository.createLabel(createLabelDto, user);
  }

  deleteLabel(id: string, user: User): Promise<void> {
    return this.labelsRepository.deleteLabel(id, user);
  }

  updateLabel(
    id: string,
    createLabelDto: CreateLabelDto,
    user: User,
  ): Promise<Label> {
    return this.labelsRepository.updateLabel(id, createLabelDto, user);
  }
}
