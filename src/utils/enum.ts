export enum RoleType {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum TokenType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}

export enum ErrorCode {
  INVALID_INPUT = 'ERR100',
  UNAUTHORIZED_TELEGRAM = 'ERR101',
}

export const COEFFICIENT = Math.pow(10, 9);
