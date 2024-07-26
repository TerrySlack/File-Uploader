//TODO:  Remove these types to a types file.
export interface Observer<T> {
  (state: T): void;
}
export interface IObservable<T> {
  notify: () => void;
  getState: () => T;
  next: (value: T) => void;
  subscribe: (observer: Observer<T>) => () => void;
}

export const createObservable = <T>(initialState: T): IObservable<T> => {
  let state = initialState;
  let observers: Observer<T>[] = [];

  return {
    subscribe(observer: Observer<T>) {
      observers.push(observer);
      observer(state); // Notify the new subscriber immediately
      return () => {
        observers = observers.filter((obs) => obs !== observer);
      };
    },
    notify() {
      observers.forEach((observer) => observer(state));
    },
    getState() {
      return state;
    },
    next(newState: T) {
      state = newState;
      this.notify();
    },
  };
};
