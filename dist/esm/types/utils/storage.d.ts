import { Session } from '../types';
export declare const saveInStorage: (session: Session) => void;
export declare const getFromStorage: () => Session | null;
export declare const clearLocalStorage: () => void;
export declare function getRefreshToken(): string | null;
