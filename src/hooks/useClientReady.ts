import { useSyncExternalStore } from "react";

const subscribe = () => {
  return () => undefined;
};

const getServerSnapshot = () => false;
const getClientSnapshot = () => true;

export const useClientReady = (): boolean => {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
};
