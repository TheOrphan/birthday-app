import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { FailedEmailLog } from './utils/failed-email-log.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailService } from './utils/email.service';
import { SchedulerService } from './utils/scheduler.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, FailedEmailLog],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([FailedEmailLog]),
    UserModule,
    ScheduleModule.forRoot(),
  ],
  providers: [EmailService, SchedulerService],
})
export class AppModule {}
