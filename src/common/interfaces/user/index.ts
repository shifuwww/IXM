export interface ICreateUser {
  email: string;
  password: string;
}

export interface IGetUser {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
