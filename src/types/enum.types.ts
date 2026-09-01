export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface IJwtReturn {
  id: string;
  email: string;
  role: Role; // Use the Enum here
}
