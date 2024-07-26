import { useCallback, useRef } from "react";

import { isEqual } from "../utils/equalityChecks";

//Need any here to get around TS not liking uknown.   I don't know the shape of a function coming into this hook
export const useCustomCallback = <T extends (...args: any[]) => unknown>(callback: T, dependencies: unknown[]) => {
  const refDependencies = useRef<unknown[]>([]);

  if (
    refDependencies.current.length === 0 ||
    !dependencies.every((dep, index) => isEqual(dep, refDependencies.current[index]))
  ) {
    //add the callback as a dependency to address the eslint error: react-hooks/exhaustive-deps
    dependencies.push(callback);
    refDependencies.current = dependencies;
  }
  return useCallback(callback, refDependencies.current);
};
