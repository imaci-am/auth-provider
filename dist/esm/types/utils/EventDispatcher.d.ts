export declare enum EventTypesEnum {
    FORCE_LOGOUT = "FORCE_LOGOUT"
}
type EventType = keyof typeof EventTypesEnum;
type ListenerType = (values: any) => void;
type ListenersType = {
    [key: string]: ListenerType[];
};
declare class EventDispatcher {
    listeners: ListenersType;
    addEventListener(event: EventType, listener: ListenerType): () => void;
    removeEventListener(event: EventType, listener: ListenerType): void;
    removeEventListeners(): void;
    dispatchEvent(event: EventType, data?: null): void;
}
declare const _default: EventDispatcher;
export default _default;
