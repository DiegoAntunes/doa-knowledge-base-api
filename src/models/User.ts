export type UserRole = 'Admin' | 'Editor' | 'Viewer';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export class User implements IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;

  constructor(params: IUser) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.role = params.role;
    this.createdAt = params.createdAt;
  }
}
