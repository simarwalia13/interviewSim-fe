import { AxiosRequestHeaders } from 'axios';
import { ObjectId } from 'mongoose';
export interface UriEndPoint {
  uri: string;
  method: string;
  version: string;
  headerProps?: AxiosRequestHeaders;
  host?: string;
}
export interface DataType {
  serialNumber: number;
  firstName: string;
  lastName: string;
  email: string;
  suggestion: string;
  website: string;
  checkbox: string[];
}
export interface Enquiry {
  save(): unknown;
  _id: ObjectId;
  email: string;
  firstname: string;
  createdBy: string;
  lastName: string;
  suggestion: string;
  checkbox: string[];
}
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: string;
  gender: string[];
  address: string;
  media: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
export interface Blog {
  title: string;
  content: string;
  route: string;
  blogInfo: string;
  metaTag: string;
  metaDescription: string;
  metaImage: string;
  publishedOn: Date;
  featured: boolean;
  notify: boolean;
  like: boolean;
  comment: boolean;
  userId: string;
  blogger: string;
  blogCategory: string;
}

export interface ForgotPassword {
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface resetPasskey {
  email: string;
  otp: string;
  expireAt?: Date;
  createdAt: Date;
}
export interface queryProps {
  data: any;
  refetch?: any;
  isLoading?: boolean;
  isFetching?: boolean;
  isFetched?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  isStale?: boolean;
  isPending?: boolean;
}

export interface role {
  name: string;
  roleId: string;
  description: string;
  roleType: string;
}
export interface RolePermission {
  roleId: ObjectId;
  permissionId: ObjectId[];
}
export interface Permission {
  name: string;
  permissionId: string;
  description?: string;
  parentId?: string;
}

export interface Upload {
  url: string;
  fileName: string;
  fileType: string;
  purpose: string;
  createdBy: ObjectId;
  status: 'Pending' | 'Done' | 'Failed';
  filesize: string;
}
export interface messages {
  message: string;
  status: string;
}

export interface profile {
  firstName: string;
  middleName: string;
  lastName: string;
  language: string;
  email: string;
  mobile: string;
  phone: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  media?: string;
  username: string;
  interest: string;
  bio: string;
}

export interface CreateGuestResponse {
  uuid: string;
  token: string;
}
