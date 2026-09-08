export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface IJwtReturn {
  id: string;
  email: string;
  role: Role; // Use the Enum here
}


//otp types
export enum OtpType {
  CHANGE_EMAIL = "CHANGE_EMAIL",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
}