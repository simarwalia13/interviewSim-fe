import type { CreateGuestResponse } from '@/Interface';
import { callApi } from '@/utils/api/apiutils';
import { Guest } from '@/utils/endpoint/guest';

export const createGuest = () =>
  callApi<CreateGuestResponse>({
    uriEndPoint: { ...Guest.CreateGuest.v1 },
  });
