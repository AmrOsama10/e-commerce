import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidDate(property: string, options?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidDate',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedProp] = args.constraints;
          const relatedValue = (args.object as any)[relatedProp];

          if (!(value instanceof Date) || isNaN(value.getTime())) return false;
          if (!(relatedValue instanceof Date) || isNaN(relatedValue.getTime()))
            return false;

          return value.getTime() > relatedValue.getTime();
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedProp] = args.constraints;
          return `${args.property} must be after ${relatedProp}`;
        },
      },
    });
  };
}
