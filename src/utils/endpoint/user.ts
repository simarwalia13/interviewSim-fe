import { defaults } from '@/utils/endpoint/default';

export const Auth = {
  login: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/auth/login',
    },
  },
  forgetPassword: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/forget-password',
    },
  },

  signup: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/auth/signup',
    },
  },
  otp: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/otp',
    },
  },
  meApi: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/me',
    },
  },
  editUser: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/users',
    },
  },
};
