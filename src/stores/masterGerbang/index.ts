import { create } from "zustand";
import {
  getGerbangData,
  addGerbangData,
  updateGerbangData,
  deleteGerbangData,
} from "../../utils/api/MasterGerbangService";
import type {
  requestAddUpdateMasterGerbang,
  requestDeleteMasterGerbang,
} from "../../utils/api/MasterGerbangService/requestModel";
import type {
  ResponseGerbangData,
  ResponseTambahGerbang,
  ResponseUpdateGerbang,
} from "../../utils/api/MasterGerbangService/responseModel";

interface GerbangState {
  data: ResponseGerbangData;
  isLoading: boolean;
  error: string | null;
  fetchGerbangData: () => Promise<void>;
  addGerbang: (
    payload: requestAddUpdateMasterGerbang,
  ) => Promise<ResponseTambahGerbang | null>;
  updateGerbang: (
    payload: requestAddUpdateMasterGerbang,
  ) => Promise<ResponseUpdateGerbang | null>;
  deleteGerbang: (payload: requestDeleteMasterGerbang) => Promise<boolean>;
  clearData: () => void;
  clearError: () => void;
}

export const useGerbangStore = create<GerbangState>((set, get) => ({
  data: {
    status: true,
    message: "",
    data: {
      total_pages: 0,
      current_page: 0,
      count: 0,
      rows: {
        count: 0,
        rows: [],
      },
    },
    code: 0,
  },
  isLoading: false,
  error: null,

  fetchGerbangData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getGerbangData();
      set({
        data: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      let errorMessage = "General Error";
      if (error instanceof Error) errorMessage = error.message;
      set({
        data: {
          status: true,
          message: "",
          data: {
            total_pages: 0,
            current_page: 0,
            count: 0,
            rows: {
              count: 0,
              rows: [],
            },
          },
          code: 0,
        },
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  addGerbang: async (payload) => {
    try {
      const response = await addGerbangData(payload);
      await get().fetchGerbangData();
      return response.data;
    } catch (error: unknown) {
      let errorMessage = "Failed to add gerbang";
      if (error instanceof Error) errorMessage = error.message;
      set({ error: errorMessage });
      return null;
    }
  },

  updateGerbang: async (payload) => {
    try {
      const response = await updateGerbangData(payload);
      await get().fetchGerbangData();
      return response.data;
    } catch (error: unknown) {
      let errorMessage = "Failed to update gerbang";
      if (error instanceof Error) errorMessage = error.message;
      set({ error: errorMessage });
      return null;
    }
  },

  deleteGerbang: async (payload) => {
    try {
      await deleteGerbangData(payload);
      await get().fetchGerbangData();
      return true;
    } catch (error: unknown) {
      let errorMessage = "Failed to delete gerbang";
      if (error instanceof Error) errorMessage = error.message;
      set({ error: errorMessage });
      return false;
    }
  },

  clearData: () =>
    set({
      data: {
        status: true,
        message: "",
        data: {
          total_pages: 0,
          current_page: 0,
          count: 0,
          rows: {
            count: 0,
            rows: [],
          },
        },
        code: 0,
      },
      isLoading: false,
      error: null,
    }),
  clearError: () => set({ error: null }),
}));
