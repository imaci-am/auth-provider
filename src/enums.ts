import { Session } from './types';

export const SessionEnum: Record<string, keyof Session> = {
  TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  EXPIRATION_DATE: 'expirationDate',
};

export enum ActionsEnum {
  LOGIN = 'login',
  SET_IS_AUTHENTICATED = 'setIsAuthenticated',
  SET_USER = 'setUser',
  LOGOUT = 'logout',
}
