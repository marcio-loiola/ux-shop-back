import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { RegexHelper } from '@common/helpers/regex.helper';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(RegexHelper.password, {
    message:
      'The password must contain uppercase letters, lowercase letters, numbers and special characters',
  })
  password: string;
}
