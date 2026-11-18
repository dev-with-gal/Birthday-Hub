export interface CreateUserData {
  email: string;
  passwordHash: string;
  role: 'EMPLOYEE';
}

export interface UpdateUserData {
  email?: string;
  passwordHash?: string;
}
