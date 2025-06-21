// Cookie management functions
export const setCookie = (name, value, options = {}) => {
  const defaultOptions = {
    path: '/',
    secure: process.env.NODE_ENV === 'prod',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  };

  const cookieOptions = { ...defaultOptions, ...options };
  
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  if (cookieOptions.maxAge) {
    cookieString += `; max-age=${cookieOptions.maxAge}`;
  }
  
  if (cookieOptions.path) {
    cookieString += `; path=${cookieOptions.path}`;
  }
  
  if (cookieOptions.domain) {
    cookieString += `; domain=${cookieOptions.domain}`;
  }
  
  if (cookieOptions.secure) {
    cookieString += '; secure';
  }
  
  if (cookieOptions.sameSite) {
    cookieString += `; samesite=${cookieOptions.sameSite}`;
  }

  document.cookie = cookieString;
};

export const getCookie = (name) => {
  const cookies = document.cookie.split(';');
  const cookie = cookies.find(c => c.trim().startsWith(`${encodeURIComponent(name)}=`));
  
  if (!cookie) return null;
  
  return decodeURIComponent(cookie.split('=')[1].trim());
};

export const removeCookie = (name) => {
  setCookie(name, '', { maxAge: -1 });
};

export const getAllCookies = () => {
  const cookies = {};
  document.cookie.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    cookies[decodeURIComponent(name)] = decodeURIComponent(value);
  });
  return cookies;
}; 