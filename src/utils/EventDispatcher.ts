export enum EventTypesEnum {
  FORCE_LOGOUT = 'FORCE_LOGOUT',
}

type EventType = keyof typeof EventTypesEnum;
type ListenerType = (values: any) => void;
type ListenersType = { [key: string]: ListenerType[] };

class EventDispatcher {
  listeners: ListenersType = {};

  addEventListener(event: EventType, listener: ListenerType) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(listener);

    return () => {
      this.removeEventListener(event, listener);
    };
  }

  removeEventListener(event: EventType, listener: ListenerType) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (l) => l !== listener
      );
    }
  }

  removeEventListeners() {
    this.listeners = {};
  }

  dispatchEvent(event: EventType, data = null) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener) => {
        listener(data);
      });
    }
  }
}

export default new EventDispatcher();
