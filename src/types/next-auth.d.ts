import { DefaultUser } from 'next-auth';
declare module 'next-auth' {
  interface Session {
    user?: DefaultUser & { id: string; role: string };
    accessToken: string;
    error: sting;
  }
  interface User extends DefaultUser {
    refreshToken: string;
    accessToken: string;
    exp: number;
    iat: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
  }
}
