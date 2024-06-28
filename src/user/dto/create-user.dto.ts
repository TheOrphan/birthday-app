import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsNotEmpty } from 'class-validator';
import { IsDateDDMMYYYY } from 'src/utils/date-format.validator';

export class CreateUserDto {
  @ApiProperty({ example: 'depan', description: 'The first name of the user' })
  @IsNotEmpty({ message: 'First name is required' })
  @IsAlpha('en-US', { message: 'First name must contain only letters' })
  firstName: string;

  @ApiProperty({
    example: 'belakang',
    description: 'The last name of the user',
  })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsAlpha('en-US', { message: 'Last name must contain only letters' })
  lastName: string;

  @ApiProperty({
    example: '29-06-2024',
    description: 'The birthday of the user in DD-MM-YYYY format',
    pattern: '^\\d{2}-\\d{2}-\\d{4}$',
  })
  @IsNotEmpty({ message: 'Birthday is required' })
  @IsDateDDMMYYYY({ message: 'Birthday must be in DD-MM-YYYY format' })
  birthday: string;

  @ApiProperty({ example: 'jakarta', description: 'The city of the user' })
  @IsNotEmpty({ message: 'City is required' })
  @IsAlpha('en-US', { message: 'City must contain only letters' })
  city: string;

  @ApiProperty({
    example: 'test.email.suryadt@yopmail.com',
    description: 'The email of the user',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
