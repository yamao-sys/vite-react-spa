import { SignInDto } from '@/apis/auth/@types';
import { getAuthApiClient } from '../../apis/getAuthApiClient';

export const postSignIn = async (data: SignInDto) => {
  const client = getAuthApiClient({ credentials: 'include' });
  const response = await client.auth.signIn.post({
    body: {
      email: data.email,
      password: data.password,
    },
  });

  return response.body;
};
