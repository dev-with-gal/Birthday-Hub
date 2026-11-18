export interface AuthenticatedRequest {
  headers: { authorization?: string };
  user?: { sub: string; email: string; role: string };
}

export interface AuthenticatedHttpRequest extends Request {
  user: { sub: string; email: string; role: string };
}
