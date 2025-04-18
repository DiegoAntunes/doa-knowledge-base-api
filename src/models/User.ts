export class User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;

  constructor(params: User) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.role = params.role;
    this.createdAt = params.createdAt;
  }
}
