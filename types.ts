import { NextPage } from 'next';

export interface User {
  _id: string;
  displayName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  active?: boolean;
  activationToken?: string;
  activationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  picture?: string;
  role: 'user' | 'moderator';
}

export interface AuthContext {
  token?: string;
  user?: User;
  isInit: boolean;
}

export type CustomNextPage<P = {}, IP = P> = NextPage<P, IP> & {
  displayBottomNavigationBar?: boolean;
  displaySearchBar?: boolean;
  hideAppbar?: boolean;
};

export interface ErrorAlert {
  message: string;
  open: boolean;
}
