import { NextPage } from "next";

export interface User {
  id: number;
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

export type CompanyType = "physical" | "entity";

export interface CompanyContacts {
  phone: string[];
  email: string[];
  address: string[];
  website: string[];
}

export interface CompanySocials {
  facebook: string;
  instragram: string;
  youtube: string;
}

export interface Company {
  id: number;
  name: string;
  tin: string;
  type: CompanyType;
  logo_url: string;
  description: string;
  contacts: CompanyContacts;
  socials: CompanySocials;
  created_at: Date;
  updated_at: Date;
}

export type ContactType = "phone" | "email" | "address" | "websait";

export interface CompanyContact {
  type: ContactType;
  value: string;
}

export interface CompanyForm {
  name: string;
  tin: string;
  type: CompanyType;
  logoUrl: string;
  description: string;
  facebook: string;
  instagram: string;
  youtube: string;
}
