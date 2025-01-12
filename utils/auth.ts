const isBrowser = typeof window !== 'undefined';

export const setToken = (token: string) => {
  if (isBrowser) {
    localStorage.setItem('jwt_token', token);
  }
};

export const getToken = () => {
  if (isBrowser) {
    return localStorage.getItem('jwt_token');
  }
  return null;
};

export const removeToken = () => {
  if (isBrowser) {
    localStorage.removeItem('jwt_token');
  }
};

export const isAuthenticated = () => {
  if (isBrowser) {
    const token = getToken();
    return !!token;
  }
  return false;
};

