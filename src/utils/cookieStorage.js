export const cookieStorage = {
  AUTH_KEYS: {
    USER: 'user',
    TOKEN: 'token',
    REFRESH_TOKEN: 'refresh_token',
  },
  getItem: (key) => {
    try {
      return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  }
};