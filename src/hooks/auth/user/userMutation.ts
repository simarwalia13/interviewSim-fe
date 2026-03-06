import { useMutation } from 'react-query';

import { Login, logOut, SignUp, VerifyEmail } from '@/services/user';

export function useSignUp() {
  return useMutation((payload: any) => SignUp(payload));
}
export function useVerifyEmail() {
  return useMutation((payload: any) => VerifyEmail(payload));
}
export function useLogin() {
  return useMutation((payload: any) => Login(payload));
}

export function useLogOut() {
  return useMutation(() => logOut());
}
