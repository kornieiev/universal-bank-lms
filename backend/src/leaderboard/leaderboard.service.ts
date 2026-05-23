import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { Enrollment } from '../courses/entity/enrollment.entity';
import { UsersService } from '../users/users.service';
import { UserRank } from '../users/interfaces/user-rank.interface';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,

    private readonly userService: UsersService,
  ) {}

  public async getTopTen(currentUserId: number) {
    const topUsers = await this.userService.getTopTenUsers();

    const topData = topUsers.map((row: Record<string, any>, index) => {
      return {
        userId: row.id as number,
        rank: index + 1,
        name: row.name as string,
        coins: Number(row.coins),
        courses_completed: Number(row.courses_completed),
      };
    });

    const currentUser = await this.userService.findUserById(currentUserId);

    const currentCompleted = await this.enrollmentRepository.count({
      where: {
        user: { id: currentUserId },
        completedAt: Not(IsNull()),
      },
    });

    const rankResult: UserRank | undefined = await this.userRepository
      .createQueryBuilder('u')
      .select('COUNT(*) + 1', 'rank')
      .where('u.coins > :coins', { coins: currentUser.coins })
      .getRawOne();

    const currentRank = Number(rankResult?.rank);

    const currentUserData = {
      currentUserId,
      rank: currentRank,
      coins: currentUser.coins,
      courses_completed: currentCompleted,
    };

    return {
      data: topData,
      current_user: currentUserData,
    };
  }
}
