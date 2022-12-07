import { FC, ReactNode, Dispatch, createContext, useReducer } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from '../types';
import {
  authReducer,
  themeReducer,
  AuthActions,
  ThemeActions,
} from './reducers';

interface AppContextState {
  auth: AuthContext;
  theme: 'light' | 'dark';
}

const contextDefaultValues: AppContextState = {
  auth: {
    isInit: false,
  },
  theme: Cookies.get('darkMode') === 'ON' ? 'dark' : 'light',
};

export const AppContext = createContext<{
  state: AppContextState;
  dispatch: Dispatch<AuthActions | ThemeActions>;
}>({
  state: contextDefaultValues,
  dispatch: () => {
    return null;
  },
});

const mainReducer = (
  { auth, theme }: AppContextState,
  action: AuthActions | ThemeActions,
) => {
  return {
    auth: authReducer(auth, action),
    theme: themeReducer(theme, action),
  };
};

const AppProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, contextDefaultValues);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
