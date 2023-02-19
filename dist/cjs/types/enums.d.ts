import { Session } from './types';
export declare const SessionEnum: Record<string, keyof Session>;
export declare enum ActionsEnum {
    LOGIN = "login",
    SET_IS_AUTHENTICATED = "setIsAuthenticated",
    SET_USER = "setUser",
    LOGOUT = "logout"
}
