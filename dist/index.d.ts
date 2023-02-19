import React, { PropsWithChildren } from 'react';

interface ProviderState<T = any> {
    isAuthenticated: boolean;
    user: T;
}
interface Session {
    accessToken: string;
    refreshToken: string;
    expirationDate?: number;
}
interface Config {
    loginExecuter: (loginProps: any) => Promise<Session>;
    logoutExecuter: (refreshToken: string) => Promise<boolean>;
    loadUser: () => Promise<{
        user: any;
    }>;
    onForceLogout?: () => void;
}

declare const forceLogout: () => void;
type NewAccessTokenPayload = {
    accessToken: string;
    refreshToken?: string;
};
type NewAccessTokenRequest = (refreshToken: string) => Promise<NewAccessTokenPayload>;
interface IProps$1 {
    newAccessTokenRequest: NewAccessTokenRequest;
}
/**
 * Dedicated to use out of Provider for example in middleware such as axios's "interceptors" or to validate current session.
 * There is no internal usage of this function in Provider.
 * @returns current session
 */
declare function getSession({ newAccessTokenRequest }: IProps$1): Promise<Session>;

interface IProps {
    config: Config;
}
declare const AuthProvider: React.FC<PropsWithChildren<IProps>>;
declare function useAuthState<T = any>(): ProviderState<T>;
declare function useAuthDispatch(): {
    login: (loginProps: any) => Promise<void>;
    loginWithSession: (accessToken: string, refreshToken: string, expirationDate?: number) => void;
    logout: () => Promise<void>;
    refetchUser: () => Promise<any>;
};

export { AuthProvider, Config, forceLogout, getSession, useAuthDispatch, useAuthState };
