import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user/entities/user.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { Workshop } from './entities/workshop.entity';

@Injectable()
export class WorkshopService {
  constructor(
    @InjectRepository(Workshop)
    private workshopRepository: Repository<Workshop>,
  ) {}

  async joinEvent(user: User, id: number) {
    try {
      //find the workshop
      const workshop = await this.workshopRepository.findOneOrFail(id);

      if (workshop.participants) {
        workshop.participants = [...workshop.participants, user];
        console.log(workshop.participants);
      } else {
        console.log('empty');
        workshop.participants = [user];
      }

      //addedd the user to the workshop
      console.log(workshop.participants);

      //save it to the database
      return await this.workshopRepository.save(workshop);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException("You're not authorized");
    }
  }

  async createWorkshop(
    createWorkshopDto: CreateWorkshopDto,
    user: User,
  ): Promise<Workshop> {
    try {
      const workshop = await this.workshopRepository.save({
        ...createWorkshopDto,
        organiser: user,
      });

      delete workshop.organiser;

      return workshop;
    } catch (error) {
      throw new BadRequestException('Cannot create workshop');
    }
  }

  async getPastWorkshops(): Promise<Workshop[]> {
    const myDate = new Date();
    const workshops = await this.workshopRepository.find({
      where: { date: LessThan(myDate) },
    });
 
    return workshops;
  }

  async getUpcomingWorkshops(): Promise<Workshop[]> {
    const myDate = new Date();
    const workshops = await this.workshopRepository.find({
      where: { date: MoreThan(myDate) },
    });
    return workshops;
  }

  async getWorkshopsForUser(user: User): Promise<Workshop[]> {
    return await this.workshopRepository.find({ organiser: user });
  }

  async getAllWorkshops(): Promise<Workshop[]> {
    try {
      return await this.workshopRepository.find();
    } catch (error) {
      throw new BadRequestException('error while finding workshops');
    }
  }

  async findWorkshopById(id: number): Promise<Workshop> {
    try {
      return await this.workshopRepository.findOne(id);
    } catch (error) {
      throw new BadRequestException(
        `error while finding workshop with id ${id}`,
      );
    }
  }

  async updateWorkshopById(
    id: number,
    updateWorkshopDto: UpdateWorkshopDto,
    user: User,
  ): Promise<Workshop> {
    try {
      let result = await this.findWorkshopById(id);
      // check if the user is the owner of the workshop
      console.log(user.workshopsCreated);
      let owner = false;
      user.workshopsCreated.forEach((item) => {
        if (item.id == id) {
          owner = true;
        }
      });

      // if he's not the owner throw an exception
      if (owner == false) {
        throw new BadRequestException();
      }

      result = { ...result, ...updateWorkshopDto };
      await this.workshopRepository.update(id, result);
      return result;
    } catch (error) {
      throw new BadRequestException(
        `error while updating workshop with id ${id}`,
      );
    }
  }

  async deleteWorkshopById(id: number) {
    const result = await this.workshopRepository.delete(id); 
    if (result.raw.affectedRows == 1) {
      return {
        message: `deleted workshop with id ${id}`,
      };
    }
    throw new BadRequestException(`error while deleting workshop with id ${id}`);
  }
}
