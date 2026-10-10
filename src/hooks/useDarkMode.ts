import { useAppContext } from "../context/SessionContext";

/** Dark mode state lives in AppProviders so the whole tree shares one source. */
export function useDarkMode() {
  const { dark, toggle } = useAppContext();
  return { dark, toggle };
}
