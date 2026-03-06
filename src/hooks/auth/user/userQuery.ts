import { useQuery } from 'react-query';

import { meApi } from '@/services/user';

export const useMe = () => {
  return useQuery<any>({
    queryKey: ['me'],
    queryFn: () => meApi(),
    refetchOnWindowFocus: false,
  });
};
