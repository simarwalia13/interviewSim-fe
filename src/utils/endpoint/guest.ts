import { defaults } from '@/utils/endpoint/default';

export const Guest = {
  CreateGuest: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/guest',
    },
  },
};
