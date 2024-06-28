import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsDateDDMMYYYY(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateDDMMYYYY',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const regex = /^\d{2}-\d{2}-\d{4}$/;
          if (typeof value !== 'string' || !regex.test(value)) {
            return false;
          }
          const parts = value.split('-');
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);
          const date = new Date(year, month, day);
          return (
            date.getFullYear() === year &&
            date.getMonth() === month &&
            date.getDate() === day
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be in DD-MM-YYYY format`;
        },
      },
    });
  };
}
