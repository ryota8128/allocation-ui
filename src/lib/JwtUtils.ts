import jwtDecode from 'jwt-decode';

interface DecodedToken {
  exp: number;
  [key: string]: any; // 他のJWTのペイロードのプロパティ（例：userIdなど）に対応するため
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    // JWTの解読に失敗した場合は有効期限切れとみなす
    return true;
  }
};
