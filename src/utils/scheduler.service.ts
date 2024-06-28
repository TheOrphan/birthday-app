import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from '../user/user.service';
import { EmailService } from './email.service';
import dayjs from 'dayjs';
import { GeocodingService } from './geocoding.service';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

@Injectable()
export class SchedulerService {
  constructor(
    private userService: UserService,
    private emailService: EmailService,
  ) {}
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    try {
      const users = await this.userService.findAll();
      const now = dayjs();
      for (const user of users) {
        let userTimezone;
        const userBirthday = dayjs(user.birthday, 'DD-MM-YYYY');
        try {
          const geocodingInfo =
            await GeocodingService.getCountryAndCityTimezone(user.city);
          userTimezone = geocodingInfo.timezone;
        } catch (error) {
          console.error('Failed to fetch geocoding information:', error);
        }
        const userTime = dayjs.tz(userBirthday, userTimezone);
        if (now.isSame(userTime, 'day') && now.hour() === 9) {
          try {
            const response = await this.emailService.sendBirthdayEmail(user);
            console.log(
              `Success to send birthday email to ${
                user.email
              } with response: ${JSON.stringify(response)}`,
            );
          } catch (error) {
            console.error(
              `Failed to send birthday email to ${user.email} after retries: ${error.message}`,
            );
          }
        }
      }
    } catch (error) {
      console.error(`Failed to schedule birthday emails: ${error.message}`);
    }
  }
}
