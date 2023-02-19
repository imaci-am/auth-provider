import { SessionEnum } from '../enums';
import { Session } from '../types';

export const saveInStorage = (session: Session) => {
  localStorage.setItem(SessionEnum.TOKEN, session['accessToken']);
  localStorage.setItem(SessionEnum.REFRESH_TOKEN, session['refreshToken']);
  const expData = session['expirationDate'];
  if (expData) localStorage.setItem(SessionEnum.EXPIRATION_DATE, expData.toString());
};

export const getFromStorage = (): Session | null => {
  if (typeof window === 'undefined') return null;

  const accessToken = localStorage.getItem(SessionEnum.TOKEN);
  const refreshToken = localStorage.getItem(SessionEnum.REFRESH_TOKEN);
  const expirationDate = localStorage.getItem(SessionEnum.EXPIRATION_DATE);

  if (!accessToken || !refreshToken || !expirationDate) {
    return null;
  }

  return { accessToken, refreshToken, expirationDate: Number(expirationDate) };
};

export const clearLocalStorage = () => {
  localStorage.removeItem(SessionEnum.TOKEN);
  localStorage.removeItem(SessionEnum.REFRESH_TOKEN);
  localStorage.removeItem(SessionEnum.EXPIRATION_DATE);
};

export function getRefreshToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(SessionEnum.REFRESH_TOKEN);
  }

  return null;
}
