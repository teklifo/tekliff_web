import { NextPage } from "next";

export interface User {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  activation_token?: string;
  activation_token_expires?: Date;
  reset_password_token?: string;
  avatar_url: string;
  created_at: Date;
  updated_at: Date;
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
