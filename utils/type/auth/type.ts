export interface EmailCheckResponse {
  duplication: boolean;
  message: string;
}

export interface NicknameCheckResponse {
  duplication: boolean;
  message: string;
}

export type Register = {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  address: string;
  sido: string;
  sigungu: string;
  dong: string;
};

export enum VerifyType {
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
}
