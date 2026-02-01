import { callApi } from '@/utils/api/apiutils';
import { Auth } from '@/utils/endpoint/user';

export const Login = ({ body }: any) =>
  callApi<any>({
    uriEndPoint: { ...Auth.login.v1 },
    body,
  });

export const SignUp = ({ body }: any) =>
  callApi<any>({
    uriEndPoint: { ...Auth.signup.v1 },
    body,
  });

export const forgetPassword = ({ body }: any) =>
  callApi<any>({
    uriEndPoint: { ...Auth.forgetPassword.v1 },
    body,
  });

export const Otp = ({ query }: any) =>
  callApi<any>({
    uriEndPoint: { ...Auth.otp.v1 },
    query,
  });
export const meApi = () =>
  callApi<any>({
    uriEndPoint: { ...Auth.meApi.v1 },
  });

export const editUser = ({ body, query }: any) =>
  callApi<any>({
    uriEndPoint: { ...Auth.editUser.v1 },
    query,
    body,
  });
