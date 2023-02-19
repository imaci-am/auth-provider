import React, { createContext, useReducer, useCallback, useEffect, useMemo, useContext } from 'react';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var SessionEnum = {
    TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    EXPIRATION_DATE: 'expirationDate',
};
var ActionsEnum;
(function (ActionsEnum) {
    ActionsEnum["LOGIN"] = "login";
    ActionsEnum["SET_IS_AUTHENTICATED"] = "setIsAuthenticated";
    ActionsEnum["SET_USER"] = "setUser";
    ActionsEnum["LOGOUT"] = "logout";
})(ActionsEnum || (ActionsEnum = {}));

var getExpirationDate = function (token) {
    var tokenObj = JSON.parse(atob(token.split('.')[1])); // TODO: deprecated — Use Buffer.from(data, 'base64') instead.
    return tokenObj.exp * 1000;
};
var validateToken = function (expirationDate) {
    if (expirationDate) {
        return new Date().getTime() < expirationDate;
    }
    return false;
};

var saveInStorage = function (session) {
    localStorage.setItem(SessionEnum.TOKEN, session['accessToken']);
    localStorage.setItem(SessionEnum.REFRESH_TOKEN, session['refreshToken']);
    var expData = session['expirationDate'];
    if (expData)
        localStorage.setItem(SessionEnum.EXPIRATION_DATE, expData.toString());
};
var getFromStorage = function () {
    if (typeof window === 'undefined')
        return null;
    var accessToken = localStorage.getItem(SessionEnum.TOKEN);
    var refreshToken = localStorage.getItem(SessionEnum.REFRESH_TOKEN);
    var expirationDate = localStorage.getItem(SessionEnum.EXPIRATION_DATE);
    if (!accessToken || !refreshToken || !expirationDate) {
        return null;
    }
    return { accessToken: accessToken, refreshToken: refreshToken, expirationDate: Number(expirationDate) };
};
var clearLocalStorage = function () {
    localStorage.removeItem(SessionEnum.TOKEN);
    localStorage.removeItem(SessionEnum.REFRESH_TOKEN);
    localStorage.removeItem(SessionEnum.EXPIRATION_DATE);
};
function getRefreshToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(SessionEnum.REFRESH_TOKEN);
    }
    return null;
}

var EventTypesEnum;
(function (EventTypesEnum) {
    EventTypesEnum["FORCE_LOGOUT"] = "FORCE_LOGOUT";
})(EventTypesEnum || (EventTypesEnum = {}));
var EventDispatcher = /** @class */ (function () {
    function EventDispatcher() {
        this.listeners = {};
    }
    EventDispatcher.prototype.addEventListener = function (event, listener) {
        var _this = this;
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
        return function () {
            _this.removeEventListener(event, listener);
        };
    };
    EventDispatcher.prototype.removeEventListener = function (event, listener) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(function (l) { return l !== listener; });
        }
    };
    EventDispatcher.prototype.removeEventListeners = function () {
        this.listeners = {};
    };
    EventDispatcher.prototype.dispatchEvent = function (event, data) {
        if (data === void 0) { data = null; }
        if (this.listeners[event]) {
            this.listeners[event].forEach(function (listener) {
                listener(data);
            });
        }
    };
    return EventDispatcher;
}());
var EventDispatcher$1 = new EventDispatcher();

var forceLogout = function () {
    EventDispatcher$1.dispatchEvent(EventTypesEnum.FORCE_LOGOUT);
};
var newAccessTokenPromise = null;
/**
 * Dedicated to use out of Provider for example in middleware such as axios's "interceptors" or to validate current session.
 * There is no internal usage of this function in Provider.
 * @returns current session
 */
function getSession(_a) {
    var _b;
    var newAccessTokenRequest = _a.newAccessTokenRequest;
    return __awaiter(this, void 0, void 0, function () {
        var _c, expirationDate, accessToken, refreshToken, isTokenValid, newAccessTokenPayload, session;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(typeof window !== 'undefined')) return [3 /*break*/, 7];
                    _c = (_b = getFromStorage()) !== null && _b !== void 0 ? _b : {}, expirationDate = _c.expirationDate, accessToken = _c.accessToken, refreshToken = _c.refreshToken;
                    isTokenValid = validateToken(expirationDate);
                    if (!(isTokenValid && expirationDate && accessToken && refreshToken)) return [3 /*break*/, 1];
                    return [2 /*return*/, Promise.resolve({ accessToken: accessToken, refreshToken: refreshToken, expirationDate: expirationDate })];
                case 1:
                    if (!refreshToken) return [3 /*break*/, 6];
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 4, , 5]);
                    newAccessTokenPayload = null;
                    if (newAccessTokenPromise === null) {
                        newAccessTokenPromise = newAccessTokenRequest(refreshToken);
                    }
                    return [4 /*yield*/, newAccessTokenPromise];
                case 3:
                    newAccessTokenPayload = _d.sent();
                    newAccessTokenPromise = null;
                    if (newAccessTokenPayload && (newAccessTokenPayload === null || newAccessTokenPayload === void 0 ? void 0 : newAccessTokenPayload.accessToken)) {
                        session = {
                            accessToken: newAccessTokenPayload.accessToken,
                            refreshToken: newAccessTokenPayload.refreshToken || refreshToken,
                            expirationDate: expirationDate,
                        };
                        saveInStorage(session);
                        return [2 /*return*/, session];
                    }
                    else {
                        forceLogout();
                        throw Error;
                    }
                case 4:
                    _d.sent();
                    forceLogout();
                    throw Error;
                case 5: return [3 /*break*/, 7];
                case 6:
                    forceLogout();
                    throw Error;
                case 7: return [2 /*return*/, { accessToken: '', refreshToken: '', expirationDate: NaN }];
            }
        });
    });
}

var initialState = {
    isAuthenticated: !!getFromStorage(),
    user: null,
};
var AuthStateContext = createContext(initialState);
var AuthDispatchContext = createContext(undefined);
var authReducer = function (state, action) {
    switch (action.type) {
        case ActionsEnum.LOGIN:
            return __assign(__assign({}, state), { user: action.user });
        case ActionsEnum.SET_IS_AUTHENTICATED:
            return __assign(__assign({}, state), { isAuthenticated: action.isAuthenticated });
        case ActionsEnum.SET_USER:
            return __assign(__assign({}, state), { user: action.user });
        case ActionsEnum.LOGOUT:
            return __assign(__assign({}, state), { isAuthenticated: false, user: null });
        default:
            return state;
    }
};
var AuthProvider = function (_a) {
    var children = _a.children, config = _a.config;
    var _b = useReducer(authReducer, initialState), state = _b[0], dispatch = _b[1];
    var isAuthenticated = state.isAuthenticated, user = state.user;
    var loadUser = useCallback(function () {
        return config
            .loadUser()
            .then(function (user) {
            dispatch({
                type: ActionsEnum.SET_USER,
                user: user,
            });
        })
            .catch(function () {
            dispatch({
                type: ActionsEnum.LOGOUT,
            });
            clearLocalStorage();
        });
    }, [config]);
    var forceLogoutHandler = useCallback(function () {
        var _a;
        dispatch({
            type: ActionsEnum.LOGOUT,
        });
        clearLocalStorage();
        (_a = config.onForceLogout) === null || _a === void 0 ? void 0 : _a.call(config);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.onForceLogout]);
    useEffect(function () {
        if (isAuthenticated && user === null) {
            loadUser();
        }
    }, [isAuthenticated, loadUser, user]);
    useEffect(function () {
        EventDispatcher$1.addEventListener(EventTypesEnum.FORCE_LOGOUT, forceLogoutHandler);
    }, [forceLogoutHandler]);
    var dispatchContext = useMemo(function () { return ({ dispatch: dispatch, config: config, refetchUser: loadUser }); }, [config, loadUser]);
    return (React.createElement(AuthStateContext.Provider, { value: state },
        React.createElement(AuthDispatchContext.Provider, { value: dispatchContext }, children)));
};
function useAuthState() {
    var state = useContext(AuthStateContext);
    if (typeof state === 'undefined') {
        throw new Error('useAuthState must be used within a AuthProvider');
    }
    return state;
}
function useAuthDispatch() {
    var _this = this;
    var context = useContext(AuthDispatchContext);
    if (typeof context === 'undefined') {
        throw new Error('useAuthDispatch must be used within a AuthProvider');
    }
    var dispatch = context.dispatch, config = context.config, refetchUser = context.refetchUser;
    var login = useCallback(function (loginProps) { return __awaiter(_this, void 0, void 0, function () {
        var _a, accessToken, refreshToken, expirationDate;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, config.loginExecuter(loginProps)];
                case 1:
                    _a = _b.sent(), accessToken = _a.accessToken, refreshToken = _a.refreshToken, expirationDate = _a.expirationDate;
                    saveInStorage({
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        expirationDate: expirationDate !== null && expirationDate !== void 0 ? expirationDate : getExpirationDate(accessToken),
                    });
                    dispatch({
                        type: ActionsEnum.SET_IS_AUTHENTICATED,
                        isAuthenticated: true,
                    });
                    return [2 /*return*/];
            }
        });
    }); }, [config, dispatch]);
    var loginWithSession = useCallback(function (accessToken, refreshToken, expirationDate) {
        saveInStorage({
            accessToken: accessToken,
            refreshToken: refreshToken,
            expirationDate: expirationDate !== null && expirationDate !== void 0 ? expirationDate : getExpirationDate(accessToken),
        });
        dispatch({
            type: ActionsEnum.SET_IS_AUTHENTICATED,
            isAuthenticated: true,
        });
    }, [dispatch]);
    var logout = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var refreshToken, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    refreshToken = getRefreshToken();
                    if (!refreshToken) return [3 /*break*/, 2];
                    return [4 /*yield*/, config.logoutExecuter(refreshToken)];
                case 1:
                    res = _a.sent();
                    if (res === false)
                        throw Error('Error while revoking token');
                    dispatch({
                        type: ActionsEnum.LOGOUT,
                    });
                    clearLocalStorage();
                    return [3 /*break*/, 3];
                case 2: throw Error('Error while getting refreshToken');
                case 3: return [2 /*return*/];
            }
        });
    }); }, [config, dispatch]);
    return {
        login: login,
        loginWithSession: loginWithSession,
        logout: logout,
        refetchUser: refetchUser,
    };
}

export { AuthProvider, forceLogout, getSession, useAuthDispatch, useAuthState };
