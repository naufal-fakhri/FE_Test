export interface ResponseLogin {
  status: boolean;
  message: string;
  code: number;
  is_logged_in: 0 | 1;
  token: string;
}
