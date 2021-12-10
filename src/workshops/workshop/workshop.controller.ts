import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/users/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/users/auth/jwt-auth.guard';
import { User } from 'src/users/user/entities/user.entity';
import { WorkshopService } from './workshop.service';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { Workshop } from './entities/workshop.entity';

@Controller('camping')
export class WorkshopController {
  constructor(private readonly workshopService: WorkshopService) {}

  @UseGuards(JwtAuthGuard)
  @Post('joinEvent/:id')
  async joinEvent(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.workshopService.joinEvent(user, id);
  }

  @Get('all')
  getAllWorkshops(): Promise<Workshop[]> {
    return this.workshopService.getAllWorkshops();
  }

  @Get('pastEvents')
  async getPastWorkshops(): Promise<Workshop[]> {
    return this.workshopService.getPastWorkshops();
  }

  @Get('upComingEvents')
  async getUpcomingWorkshops(): Promise<Workshop[]> {
    return this.workshopService.getUpcomingWorkshops();
  }

  @Get('user')
  @UseGuards(AuthGuard())
  getWorkshopsForUser(@GetUser() user: User): Promise<Workshop[]> {
    return this.workshopService.getWorkshopsForUser(user);
  }

  @UseGuards(JwtAuthGuard) //to force auth to create workshops
  @Post()
  createWorkshop(
    @Body() createWorkshopDto: CreateWorkshopDto,
    @GetUser() user: User,
  ): Promise<Workshop> {
    return this.workshopService.createWorkshop(createWorkshopDto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateWorkshopById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkshopDto: UpdateWorkshopDto,
    @GetUser() user: User,
  ): Promise<Workshop> {
    return this.workshopService.updateWorkshopById(id, updateWorkshopDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteWorkshopById(@Param('id', ParseIntPipe) id: number) {
    return this.workshopService.deleteWorkshopById(id);
  }

  @Get(':id')
  findWorkshopById(@Param('id', ParseIntPipe) id: number): Promise<Workshop> {
    return this.workshopService.findWorkshopById(id);
  }
}
