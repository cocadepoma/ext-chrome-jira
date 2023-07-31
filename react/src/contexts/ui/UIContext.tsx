import { createContext } from 'react';

export interface ContextProps {
  sideMenuOpen: boolean;
  isAddingEntry: boolean;
  isDragging: boolean;
  isAppLoading: boolean;

  openSideMenu: () => void;
  closeSideMenu: () => void;
  setIsAddingEntry: (value: boolean) => void;
  onStartDragging: () => void;
  onEndDragging: () => void;
  onStopAppLoading: () => void;
  onStartAppLoading: () => void;
}

export const UIContext = createContext({} as ContextProps);