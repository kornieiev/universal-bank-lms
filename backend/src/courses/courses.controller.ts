import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ActiveUser } from '../auth/decorators/active-user.decorator';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  public async findAll() {
    return await this.coursesService.findAll();
  }

  @Post(':id/enroll')
  public async enrollCourse(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser('sub') userId: number,
  ) {
    return await this.coursesService.enrollCourse(userId, id);
  }
}
