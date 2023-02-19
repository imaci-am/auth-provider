import { LoginType, LogoutType, SetIsAuthenticatedType, SetUserType } from './actionTypes';
export interface ProviderState<T = any> {
    isAuthenticated: boolean;
    user: T;
}
export interface Session {
    accessToken: string;
    refreshToken: string;
    expirationDate?: number;
}
export interface Config {
    loginExecuter: (loginProps: any) => Promise<Session>;
    logoutExecuter: (refreshToken: string) => Promise<boolean>;
    loadUser: () => Promise<{
        user: any;
    }>;
    onForceLogout?: () => void;
}
export type ActionType = LoginType | SetIsAuthenticatedType | SetUserType | LogoutType;
