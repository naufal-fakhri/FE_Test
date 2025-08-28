import type { RequestLalinData } from "./requestModel.ts";
import axios from "axios";
import type { ResponseLalinData } from "./responseModel.ts";
import { getApiUrl } from "../index.ts";

const envURl = getApiUrl();

export const getLalinData = (payload: RequestLalinData | undefined) =>
  !payload
    ? axios.get<ResponseLalinData>(`${envURl}/api/lalins`)
    : axios.get<ResponseLalinData>(
        `${envURl}/api/lalins?tanggal=${payload.tanggal}`,
      );
