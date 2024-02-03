export const parseCookies = <T extends {[key: string]: string}>(headerCookie: string): T => {
  const cookies = headerCookie
    .split('; ')
    .map((cookie) => cookie.split('='));
  return Object.fromEntries(cookies);
};
