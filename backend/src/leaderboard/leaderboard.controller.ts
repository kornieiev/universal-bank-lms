import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { ActiveUser } from '../auth/decorators/active-user.decorator';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  public async getTopTen(@ActiveUser('sub') currentUserId: number) {
    return await this.leaderboardService.getTopTen(currentUserId);
  }
}
