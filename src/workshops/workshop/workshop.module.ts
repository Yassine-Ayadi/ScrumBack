import { Module } from '@nestjs/common';
import { WorkshopService } from './workshop.service';
import { WorkshopController } from './workshop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workshop } from './entities/workshop.entity';
import { User } from 'src/users/user/entities/user.entity';
import { AuthModule } from 'src/users/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Workshop, User]), AuthModule],
  controllers: [WorkshopController],
  providers: [WorkshopService],
})
export class WorkshopModule {}
