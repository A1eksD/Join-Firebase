export interface User {
  id?: string;
  uid?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  savedUsers?: any[];
  phoneNumber?: number;
  status: boolean;
  color?: string;
}
