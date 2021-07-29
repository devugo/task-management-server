import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { Logger } from '@nestjs/common';
import { Label } from 'src/labels/label.entity';
import { Project } from 'src/projects/project.entity';
import { Level } from 'src/levels/level.entity';
import { CustomService } from './custom.service';

@Controller('custom')
@UseGuards(AuthGuard())
export class CustomController {
  private logger = new Logger('CustomController');
  constructor(private customService: CustomService) {}

  @Get('/starter-data')
  getStarterData(@GetUser() user: User): Promise<{
    labels: Label[];
    projects: Project[];
    levels: Level[];
  }> {
    this.logger.verbose(`User "${user.username}" retrieving starter data.`);
    return this.customService.getStarterData(user);
  }
}
