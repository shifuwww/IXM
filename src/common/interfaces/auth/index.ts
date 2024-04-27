export interface IAtJwt {
  sub: string;
  email: string;
  exp?: number;
}

export interface IRtJwt extends IAtJwt {
  refreshToken: string;
}

export interface ISignIn {
  email: string;
  password: string;
}

export interface ISignUp {
  email: string;
  code: string;
}

export interface ISignUpRequest {
  email: string;
  password: string;
}

export interface ISignData {
  password: string;
  code: string;
  timeToSend: number;
}

export interface ISign {
  refreshToken: string;
  accessToken: string;
}

export interface ISignResponse extends Omit<ISign, 'refreshToken'> {}
