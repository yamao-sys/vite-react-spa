import { ValidationError } from 'class-validator';

export function formatValidationErrors(errors: ValidationError[]) {
  const result: { [key: string]: Array<string> } = {};

  errors.forEach((error) => {
    // エラーメッセージを配列に
    const messages = [];
    for (const key in error.constraints) {
      messages.push(error.constraints[key]);
    }
    // 戻り値のhashに追加
    result[error.property] = messages;
  });

  return result;
}
