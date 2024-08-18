import { SignUpDto } from '@/generated/auth/@types';
import { getAuthApiClient } from '../../apis/getAuthApiClient';

export const postValidateSignUp = async (data: SignUpDto) => {
  const client = getAuthApiClient();
  const response = await client.auth.validateSignUp.post({
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    },
  });

  return { errors: response.body.errors };
};

export const postSignUp = async (data: SignUpDto) => {
  const client = getAuthApiClient();
  const response = await client.auth.signUp.post({
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    },
  });

  return { result: response.body.result };
};
