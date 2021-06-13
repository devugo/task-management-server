import { Controller, Get, Logger, Query } from '@nestjs/common';
import { Level } from './level.entity';
import { LevelsService } from './levels.service';

@Controller('levels')
export class LevelsController {
  private logger = new Logger('LevelsController');
  constructor(private levelsService: LevelsService) {}

  @Get()
  getLevels(): Promise<Level[]> {
    this.logger.verbose(`Retrieving levels`);
    return this.levelsService.getLevels();
  }
}
