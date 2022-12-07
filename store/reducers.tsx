import { Reducer } from 'react';
import { AuthContext } from '../types';

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum Types {
  LoadUser = 'LOAD_USER',
  LoginUser = 'LOGIN_USER',
  VerifyUser = 'VERIFY_USER',
  Logout = 'LOGOUT',
  DeleteUser = 'DELETE_USER',
  SetTheme = 'SET_THEME',
}

// PAYLOAD TYPES
type AuthPayload = {
  [Types.LoadUser]: AuthContext;
  [Types.LoginUser]: string;
  [Types.VerifyUser]: string;
  [Types.Logout]: null;
  [Types.DeleteUser]: null;
};

type ThemePayload = {
  [Types.SetTheme]: 'light' | 'dark';
};

// ACTION TYPES
export type AuthActions = ActionMap<AuthPayload>[keyof ActionMap<AuthPayload>];

export type ThemeActions =
  ActionMap<ThemePayload>[keyof ActionMap<ThemePayload>];

// REDUCERS
export const authReducer: Reducer<AuthContext, AuthActions | ThemeActions> = (
  state,
  action,
) => {
  switch (action.type) {
    case Types.LoadUser:
      return {
        ...action.payload,
      };
    case Types.LoginUser:
    case Types.VerifyUser:
      return {
        ...state,
        token: action.payload,
      };
    case Types.Logout:
    case Types.DeleteUser:
      return {
        ...state,
        token: undefined,
        user: undefined,
      };
    default:
      return state;
  }
};

export const themeReducer: Reducer<
  'light' | 'dark',
  AuthActions | ThemeActions
> = (state, action) => {
  switch (action.type) {
    case Types.SetTheme:
      return action.payload;
    default:
      return state;
  }
};
