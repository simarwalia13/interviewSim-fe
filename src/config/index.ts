import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {
  DB_DATABASE,
  DB_HOST,
  HOSTNAME,
  NEXTAUTH_SECRET,
  DB_NAME,
  EXPIRE_DAY,
  HOST_URI,
  JWT_SECRET,
  AWS_SES_ACCESS_KEY_ID,
  AWS_SES_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET_NAME,
} = process.env;
