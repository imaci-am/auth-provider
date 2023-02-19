export const getExpirationDate = (token: string): number => {
  const tokenObj = JSON.parse(atob(token.split('.')[1])); // TODO: deprecated — Use Buffer.from(data, 'base64') instead.

  return tokenObj.exp * 1000;
};

export const validateToken = (expirationDate?: number) => {
  if (expirationDate) {
    return new Date().getTime() < expirationDate;
  }
  return false;
};
