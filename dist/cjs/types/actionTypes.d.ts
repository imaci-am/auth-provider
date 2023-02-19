import { ActionsEnum } from './enums';
export type LoginType = {
    type: ActionsEnum.LOGIN;
    user: any;
};
export type SetIsAuthenticatedType = {
    type: ActionsEnum.SET_IS_AUTHENTICATED;
    isAuthenticated: boolean;
};
export type SetUserType = {
    type: ActionsEnum.SET_USER;
    user: any;
};
export type LogoutType = {
    type: ActionsEnum.LOGOUT;
};
