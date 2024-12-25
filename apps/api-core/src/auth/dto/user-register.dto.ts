import {
  EmailField,
  PasswordField,
} from 'libs/utils/decorators/field.decorator';

export class UserRegisterDto {
  @EmailField()
  readonly email!: string;

  @PasswordField()
  readonly password!: string;
}
