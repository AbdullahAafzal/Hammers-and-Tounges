import Cookies from 'js-cookie';

const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: import.meta.env.PROD,
  sameSite: 'strict',
  path: '/',
};

export const cookieStorage = {
  setItem: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      Cookies.set(key, serializedValue, COOKIE_OPTIONS);
      return true;
    } catch (error) {
      console.error(`Error setting cookie ${key}:`, error);
      return false;
    }
  },

  getItem: (key) => {
    try {
      const value = Cookies.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting cookie ${key}:`, error);
      return null;
    }
  },

  removeItem: (key) => {
    try {
      Cookies.remove(key, { path: '/' });
      return true;
    } catch (error) {
      console.error(`Error removing cookie ${key}:`, error);
      return false;
    }
  },

  clear: () => {
    try {
      const allCookies = Cookies.get();
      Object.keys(allCookies).forEach((key) => {
        Cookies.remove(key, { path: '/' });
      });
      return true;
    } catch (error) {
      console.error('Error clearing cookies:', error);
      return false;
    }
  },

  // Specific auth cookie keys
  AUTH_KEYS: {
    TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user_data',
    TOKEN_TIMESTAMP: 'token_timestamp',
    ROLE: 'user_role',
  },
};