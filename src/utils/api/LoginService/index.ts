import type { RequestLogin } from "./requestModel.ts";
import axios from "axios";
import type { ResponseLogin } from "./responseModel.ts";
import { getApiUrl } from "../index.ts";

const envURl = getApiUrl();

export const LoginService = (payload: RequestLogin) =>
  axios.post<ResponseLogin>(`${envURl}/api/auth/login`, payload);
