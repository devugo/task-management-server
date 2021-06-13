import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateLabelDto } from './dto/create-label.dto';
import { GetLabelsFilterDto } from './dto/get-labels-filter.dto';
import { Label } from './label.entity';
import { LabelsService } from './labels.service';

@Controller('labels')
@UseGuards(AuthGuard())
export class LabelsController {
  private logger = new Logger('LabelsController');
  constructor(private labelsService: LabelsService) {}

  @Get()
  getLabels(
    @Query() filterDto: GetLabelsFilterDto,
    @GetUser() user: User,
  ): Promise<Label[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.labelsService.getLabels(filterDto, user);
  }

  @Get('/:id')
  getTask(@Param('id') id: string, @GetUser() user: User): Promise<Label> {
    return this.labelsService.getLabel(id, user);
  }

  @Post()
  createLabel(
    @Body() createLabelDto: CreateLabelDto,
    @GetUser() user: User,
  ): Promise<Label> {
    return this.labelsService.createLabel(createLabelDto, user);
  }

  @Delete('/:id')
  deleteLabel(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.labelsService.deleteLabel(id, user);
  }

  @Patch('/:id')
  updateLabel(
    @Param('id') id: string,
    @Body() createLabelDto: CreateLabelDto,
    @GetUser() user: User,
  ): Promise<Label> {
    return this.labelsService.updateLabel(id, createLabelDto, user);
  }
}
