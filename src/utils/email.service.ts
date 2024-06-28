import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { FailedEmailLog } from './failed-email-log.entity';
import * as retry from 'retry';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(FailedEmailLog)
    private failedEmailLogRepository: Repository<FailedEmailLog>,
  ) {}

  async sendBirthdayEmail(user: User) {
    const operation = retry.operation({
      retries: 5,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 60000,
    });

    return new Promise<void>((resolve, reject) => {
      operation.attempt(async (currentAttempt) => {
        try {
          const response = await axios.post(
            'https://email-service.digitalenvision.com.au/send-email',
            {
              email: user.email,
              message: `Hey, ${
                user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
              } ${
                user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)
              }, it’s your birthday!`,
            },
          );
          resolve(response.data);
        } catch (error) {
          if (operation.retry(error)) {
            console.warn(`Attempt ${currentAttempt} failed. Retrying...`);
            return;
          }
          console.error(
            `Failed to send email to ${user.email}: ${error.message}`,
          );
          await this.failedEmailLogRepository.save({
            userId: user.id,
            email: user.email,
            error: error.message,
          });
          reject(operation.mainError());
        }
      });
    });
  }
}
