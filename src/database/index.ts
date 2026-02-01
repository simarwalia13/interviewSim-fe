import { DB_HOST, DB_NAME } from '@/config';

export const dbConnection = {
  url: `${DB_HOST}`,
  DatabaseName: `${DB_NAME}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
