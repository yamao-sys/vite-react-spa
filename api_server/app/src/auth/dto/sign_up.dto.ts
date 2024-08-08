import { isEqual } from '../../validators/is-equal';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: 'ユーザ名は必須です。' })
  name: string;

  @IsNotEmpty({ message: 'メールアドレスは必須です。' })
  @IsEmail(
    {},
    { message: 'メールアドレスの形式はxxx@example.comでお願いします。' },
  )
  email: string;

  @IsNotEmpty({ message: 'パスワードは必須です。' })
  @Length(8, 20, {
    message: 'パスワードは8文字以上20文字以内で入力をお願いします。',
  })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, {
    message:
      'パスワードは半角英数字の大文字・小文字・数字をそれぞれ最低1文字で入力をお願いします。',
  })
  password: string;

  @IsNotEmpty({ message: 'パスワード確認用は必須です。' })
  @isEqual('password', {
    message: 'パスワードとパスワード確認用が異なります。',
  })
  passwordConfirm: string;
}
