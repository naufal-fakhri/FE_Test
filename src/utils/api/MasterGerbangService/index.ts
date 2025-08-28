import axios from "axios";
import type {
  requestAddUpdateMasterGerbang,
  requestDeleteMasterGerbang,
} from "./requestModel.ts";
import type {
  ResponseGerbangData,
  ResponseTambahGerbang,
  ResponseUpdateGerbang,
} from "./responseModel.ts";
import { getApiUrl } from "../index.ts";

const envUrl = getApiUrl();

export const getGerbangData = () =>
  axios.get<ResponseGerbangData>(`${envUrl}/api/gerbangs`);

export const addGerbangData = (payload: requestAddUpdateMasterGerbang) =>
  axios.post<ResponseTambahGerbang>(`${envUrl}/api/gerbangs`, payload);

export const updateGerbangData = (payload: requestAddUpdateMasterGerbang) =>
  axios.put<ResponseUpdateGerbang>(`${envUrl}/api/gerbangs`, payload);

export const deleteGerbangData = (payload: requestDeleteMasterGerbang) =>
  axios.delete(`${envUrl}/api/gerbangs`, {
    data: payload,
  });
