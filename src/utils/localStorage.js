export const localStorage = {
  getItem: (key) => {
    try {
      return window.localStorage.getItem(key) ? JSON.parse(window.localStorage.getItem(key)) : null;
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: (key) => {
    window.localStorage.removeItem(key);
  },
  clear: () => {
    window.localStorage.clear();
  }
};