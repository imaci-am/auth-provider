import React, { PropsWithChildren } from 'react';
import { Config, ProviderState } from './types';
import { forceLogout, getSession } from './utils';
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
export { AuthProvider, useAuthDispatch, useAuthState, forceLogout, getSession };
export type { Config };
