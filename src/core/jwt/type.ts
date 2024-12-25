export enum TokenType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}

export type TokenPayload = {
  id: string;
  type: TokenType;
  refer: 'account' | 'user';
};
