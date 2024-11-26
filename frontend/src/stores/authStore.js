// stores/index.js
import { create } from "zustand";

const initUserFromStorage = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedUser');
  if (loggedUserJSON) {
    const storageUser = JSON.parse(loggedUserJSON);
    return storageUser;
  }
  return { userId: null, userName: null, status: null, token: null, infoCompleted: false };
};

export const useAuthStore = create((set) => ({
  user: initUserFromStorage(),
  setUser: (user) => {
    set({ user });
  },
  clearUser: () => {
    set({ user: { userId: null, userName: null, status: null, token: null, infoCompleted: false } });
  },
}));