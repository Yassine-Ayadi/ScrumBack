import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUser(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.userService.updateUser(user, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('upComingEvent')
  async getUpComingEventsOfUser(@GetUser() user: User) {
    const workshops = await (
      await this.userService.getEventsOfUser(user)
    ).workshopsCreated;

    const myDate = new Date();

    return workshops.filter(
      (workshop) => workshop.date.getTime() > myDate.getTime(),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('latestEvents')
  async getLatestEventsOfUser(@GetUser() user: User) {
    const workshops = await (
      await this.userService.getEventsOfUser(user)
    ).workshopsCreated;

    const myDate = new Date();

    return workshops.filter(
      (workshop) => workshop.date.getTime() < myDate.getTime(),
    );
  }
}
