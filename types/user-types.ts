export interface User {
  id: string;
  email: string;
  username: string | null;
  role: string | null;
  createdAt: string;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
}
