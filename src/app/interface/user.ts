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

export interface LoginData {
  jwtToken: string;
  userName: string;
}

export interface ApiResponseLogin {
  status: string;
  data: LoginData;
  message: string | null;
}