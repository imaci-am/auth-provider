import { Session } from '../types';
export declare const forceLogout: () => void;
type NewAccessTokenPayload = {
    accessToken: string;
    refreshToken?: string;
};
type NewAccessTokenRequest = (refreshToken: string) => Promise<NewAccessTokenPayload>;
interface IProps {
    newAccessTokenRequest: NewAccessTokenRequest;
}
/**
 * Dedicated to use out of Provider for example in middleware such as axios's "interceptors" or to validate current session.
 * There is no internal usage of this function in Provider.
 * @returns current session
 */
export declare function getSession({ newAccessTokenRequest }: IProps): Promise<Session>;
export {};
