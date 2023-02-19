import { validateToken } from './token';
import { getFromStorage, saveInStorage } from './storage';
import EventsDispatcher, { EventTypesEnum } from './EventDispatcher';
import { Session } from '../types';

export const forceLogout = () => {
  EventsDispatcher.dispatchEvent(EventTypesEnum.FORCE_LOGOUT);
};

type NewAccessTokenPayload = { accessToken: string; refreshToken?: string };
type NewAccessTokenPromise = Promise<NewAccessTokenPayload>;
type NewAccessTokenRequest = (refreshToken: string) => Promise<NewAccessTokenPayload>;

interface IProps {
  newAccessTokenRequest: NewAccessTokenRequest;
}

let newAccessTokenPromise: NewAccessTokenPromise | null = null;

/**
 * Dedicated to use out of Provider for example in middleware such as axios's "interceptors" or to validate current session.
 * There is no internal usage of this function in Provider.
 * @returns current session
 */
export async function getSession({ newAccessTokenRequest }: IProps): Promise<Session> {
  if (typeof window !== 'undefined') {
    const { expirationDate, accessToken, refreshToken } = getFromStorage() ?? {};

    const isTokenValid = validateToken(expirationDate);

    if (isTokenValid && expirationDate && accessToken && refreshToken) {
      return Promise.resolve({ accessToken, refreshToken, expirationDate });
    } else {
      if (refreshToken) {
        try {
          let newAccessTokenPayload: NewAccessTokenPayload | null = null;

          if (newAccessTokenPromise === null) {
            newAccessTokenPromise = newAccessTokenRequest(refreshToken);
          }

          newAccessTokenPayload = await newAccessTokenPromise;
          newAccessTokenPromise = null;

          if (newAccessTokenPayload && newAccessTokenPayload?.accessToken) {
            const session: Session = {
              accessToken: newAccessTokenPayload.accessToken,
              refreshToken: newAccessTokenPayload.refreshToken || refreshToken,
              expirationDate: expirationDate,
            };

            saveInStorage(session);

            return session;
          } else {
            forceLogout();
            throw Error;
          }
        } catch (error) {
          forceLogout();
          throw Error;
        }
      } else {
        forceLogout();
        throw Error;
      }
    }
  }

  return { accessToken: '', refreshToken: '', expirationDate: NaN };
}
