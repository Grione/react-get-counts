import { createContext, useContext } from 'react';
import RootStore from '../models/RootStore';

export const StoreContext = createContext<null | typeof RootStore.Type>(null);

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return store;
};