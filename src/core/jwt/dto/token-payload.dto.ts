export class TokenPayloadDto {
  accessToken: string;

  constructor(data: { accessToken: string }) {
    this.accessToken = data.accessToken;
  }
}
