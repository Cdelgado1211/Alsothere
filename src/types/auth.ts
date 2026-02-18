export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Session {
  user: User;
  tenantId: string;
  companyName: string;
}

