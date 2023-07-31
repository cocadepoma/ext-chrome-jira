import { FC, useReducer } from 'react';
import { UIContext, uiReducer } from '.';
import { FullScreenSpinner } from '../../components/ui/FullScreenSpinner/FullScreenSpinner';

export interface UIState {
  sideMenuOpen: boolean;
  isAddingEntry: boolean;
  isDragging: boolean;
  isAppLoading: boolean;
}

interface UIProviderProps {
  children: React.ReactNode
}

const UI_INITIAL_STATE: UIState = {
  sideMenuOpen: false,
  isAddingEntry: false,
  isDragging: false,
  isAppLoading: true,
};

export const UIProvider: FC<UIProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const openSideMenu = (): void => {
    dispatch({ type: 'UI - Open Sidebar' });
  };

  const closeSideMenu = (): void => {
    dispatch({ type: 'UI - Close Sidebar' });
  };

  const setIsAddingEntry = (isAdding: boolean) => {
    dispatch({ type: 'UI - Set isAddingEntry', payload: isAdding })
  };

  const onStartDragging = () => {
    dispatch({ type: 'UI - Start Dragging' });
  };

  const onEndDragging = () => {
    dispatch({ type: 'UI - End Dragging' });
  };

  const onStopAppLoading = () => {
    dispatch({ type: 'UI - Stop loading' });
  };

  const onStartAppLoading = () => {
    dispatch({ type: 'UI - Start Dragging' });
  };

  return (
    <UIContext.Provider
      value={{
        ...state,
        openSideMenu,
        closeSideMenu,
        setIsAddingEntry,
        onStartDragging,
        onEndDragging,
        onStopAppLoading,
        onStartAppLoading,
      }}
    >
      {state.isAppLoading && <FullScreenSpinner />}
      {children}
    </UIContext.Provider>
  );
};