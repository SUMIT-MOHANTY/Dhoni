export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  date_joined?: string;
}
