import { createContext, useContext } from "react";
import { usePageState } from "./usePageState";
import type { Page } from "../utils/types";
import { WithInitialState } from "./WithInitialState";

type AppStateContextType = ReturnType<typeof usePageState>;

const AppStateContext = createContext<AppStateContextType>(
  {} as AppStateContextType
);

type AppStateProviderProps = {
  children: React.ReactNode;
  initialState: Page;
};

export const AppStateProvider = WithInitialState<AppStateProviderProps>(
  ({ children, initialState }: AppStateProviderProps) => {
    const pageStateHandlers = usePageState(initialState);

    return (
      <AppStateContext.Provider value={pageStateHandlers}>
        {children}
      </AppStateContext.Provider>
    );
  }
);

export const useAppState = () => useContext(AppStateContext);
