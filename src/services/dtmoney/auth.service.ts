import { dtmoneyApi } from '@/shared/api/dtmoney';
import { IAuthenticateResponse } from '@/interfaces/http/authenticate-response';
import { FormLoginParams, FormRegisterParams } from '@/shared/types/forms';

export async function authenticate(
  userData: FormLoginParams
): Promise<IAuthenticateResponse> {
  const { data } = await dtmoneyApi.post<IAuthenticateResponse>(
    '/auth/login',
    userData
  );
  return data;
}

export async function registerUser(
  userData: Omit<FormRegisterParams, 'confirmPassword'>
): Promise<IAuthenticateResponse> {
  const { data } = await dtmoneyApi.post<IAuthenticateResponse>(
    '/auth/register',
    userData
  );
  return data;
}
