import { useState, useEffect, useRef } from "react";

export const useSyncedState = <TState>(
  initialState: TState,
  syncCallback: (state: TState) => void
): [TState, React.Dispatch<React.SetStateAction<TState>>] => {
  const [state, setState] = useState<TState>(initialState);
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      syncCallback(state);
    } else {
      didMountRef.current = true;
    }
  }, [state]);

  return [state, setState];
};
