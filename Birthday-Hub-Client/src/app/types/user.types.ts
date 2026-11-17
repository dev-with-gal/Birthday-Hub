export interface CreateUserRequest {
  email: string;
  password: string;
}

export interface CreatedUserResponse {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
