import React, {
  createContext,
  useReducer,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  PropsWithChildren,
} from 'react';

import { ActionsEnum } from './enums';
import { ActionType, Config, ProviderState } from './types';
import { getFromStorage, saveInStorage, getExpirationDate, clearLocalStorage } from './utils';
import { getRefreshToken, forceLogout, getSession } from './utils';
import EventDispatcher, { EventTypesEnum } from './utils/EventDispatcher';

const initialState: ProviderState = {
  isAuthenticated: !!getFromStorage(),
  user: null,
};

const AuthStateContext = createContext(initialState);
const AuthDispatchContext = createContext<
  | {
      dispatch: React.Dispatch<ActionType>;
      config: Config;
      refetchUser: () => Promise<any>;
    }
  | undefined
>(undefined);

const authReducer = (state: typeof initialState, action: ActionType) => {
  switch (action.type) {
    case ActionsEnum.LOGIN:
      return {
        ...state,
        user: action.user,
      };

    case ActionsEnum.SET_IS_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
      };

    case ActionsEnum.SET_USER:
      return {
        ...state,
        user: action.user,
      };

    case ActionsEnum.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    default:
      return state;
  }
};

interface IProps {
  config: Config;
}

const AuthProvider: React.FC<PropsWithChildren<IProps>> = ({ children, config }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { isAuthenticated, user } = state;

  const loadUser = useCallback(() => {
    return config
      .loadUser()
      .then((user) => {
        dispatch({
          type: ActionsEnum.SET_USER,
          user: user,
        });
      })
      .catch(() => {
        dispatch({
          type: ActionsEnum.LOGOUT,
        });
        clearLocalStorage();
      });
  }, [config]);

  const forceLogoutHandler = useCallback(() => {
    dispatch({
      type: ActionsEnum.LOGOUT,
    });
    clearLocalStorage();

    config.onForceLogout?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.onForceLogout]);

  useEffect(() => {
    if (isAuthenticated && user === null) {
      loadUser();
    }
  }, [isAuthenticated, loadUser, user]);

  useEffect(() => {
    EventDispatcher.addEventListener(EventTypesEnum.FORCE_LOGOUT, forceLogoutHandler);
  }, [forceLogoutHandler]);

  const dispatchContext = useMemo(() => ({ dispatch, config, refetchUser: loadUser }), [config, loadUser]);
  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatchContext}>{children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

function useAuthState<T = any>() {
  const state = useContext<ProviderState<T>>(AuthStateContext);

  if (typeof state === 'undefined') {
    throw new Error('useAuthState must be used within a AuthProvider');
  }

  return state;
}

function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);

  if (typeof context === 'undefined') {
    throw new Error('useAuthDispatch must be used within a AuthProvider');
  }

  const { dispatch, config, refetchUser } = context;

  const login = useCallback(
    async (loginProps: any) => {
      const { accessToken, refreshToken, expirationDate } = await config.loginExecuter(loginProps);

      saveInStorage({
        accessToken,
        refreshToken,
        expirationDate: expirationDate ?? getExpirationDate(accessToken),
      });

      dispatch({
        type: ActionsEnum.SET_IS_AUTHENTICATED,
        isAuthenticated: true,
      });
    },
    [config, dispatch]
  );

  const loginWithSession = useCallback(
    (accessToken: string, refreshToken: string, expirationDate?: number) => {
      saveInStorage({
        accessToken,
        refreshToken,
        expirationDate: expirationDate ?? getExpirationDate(accessToken),
      });

      dispatch({
        type: ActionsEnum.SET_IS_AUTHENTICATED,
        isAuthenticated: true,
      });
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      const res = await config.logoutExecuter(refreshToken);
      if (res === false) throw Error('Error while revoking token');

      dispatch({
        type: ActionsEnum.LOGOUT,
      });
      clearLocalStorage();
    } else {
      throw Error('Error while getting refreshToken');
    }
  }, [config, dispatch]);

  return {
    login,
    loginWithSession,
    logout,
    refetchUser,
  };
}

export { AuthProvider, useAuthDispatch, useAuthState, forceLogout, getSession };
export type { Config };
