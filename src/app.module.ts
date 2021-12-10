import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkshopModule } from './workshops/workshop/workshop.module';
import { UserModule } from './users/user/user.module';
import { AuthModule } from './users/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'agrilink',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    WorkshopModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
