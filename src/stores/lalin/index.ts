import { create } from "zustand";
import type {
  CabangCount,
  DataResponse,
  PaymentGroups,
  PaymentSummary,
  RowData,
  RowDataTable,
  ShiftCount,
  TrafficCount,
} from "../../utils/api/LalinService/responseModel.ts";
import type { RequestLalinData } from "../../utils/api/LalinService/requestModel.ts";
import { getLalinData } from "../../utils/api/LalinService";
import { formatToMMDDYYYY } from "../../utils/helpers";

interface LalinState {
  data: DataResponse | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  selectedDate: string | null;
  paymentSummaryData: PaymentSummary;
  trafficSummaryData: TrafficCount;
  shiftSummaryData: ShiftCount;
  cabangSummaryData: CabangCount;
  paymentGroups: PaymentGroups;
  fetchLalinData: (payload?: RequestLalinData) => Promise<void>;
  setCurrentPage: (page: number) => void;
  setSelectedDate: (date: string | null) => void;
  clearData: () => void;
  clearError: () => void;

  getRows: () => RowData[];
  getTotalCount: () => number;
  getPaymentSummary: () => PaymentSummary;
  getTrafficCount: () => TrafficCount[];
  getShiftCount: () => ShiftCount;
  getCabangCount: () => CabangCount[];
  getPaymentGroups: () => PaymentGroups;
}

export const useLalinStore = create<LalinState>((set, get) => ({
  data: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  selectedDate: null,
  paymentSummaryData: {
    Tunai: 0,
    DinasOpr: 0,
    DinasMitra: 0,
    DinasKary: 0,
    eMandiri: 0,
    eBri: 0,
    eBni: 0,
    eBca: 0,
    eNobu: 0,
    eDKI: 0,
    eMega: 0,
    eFlo: 0,
    summary: {
      tunai: 0,
      ktp: 0,
      etoll: 0,
      flo: 0,
    },
    total: 0,
  },
  trafficSummaryData: {
    nomorGerbang: "",
    total: 0,
  },
  shiftSummaryData: {
    shift1: 0,
    shift2: 0,
    shift3: 0,
  },
  cabangSummaryData: {
    name: "",
    value: 0,
  },
  paymentGroups: {
    tunai: [
      {
        id: 0,
        Tanggal: "",
        Shift: 0,
        IdGerbang: 0,
        IdGardu: 0,
        IdCabang: 0,
        IdAsalGerbang: 0,
        Golongan: 0,
      },
    ],
    ktp: [
      {
        id: 0,
        Tanggal: "",
        Shift: 0,
        IdGerbang: 0,
        IdGardu: 0,
        IdCabang: 0,
        IdAsalGerbang: 0,
        Golongan: 0,
      },
    ],
    flo: [
      {
        id: 0,
        Tanggal: "",
        Shift: 0,
        IdGerbang: 0,
        IdGardu: 0,
        IdCabang: 0,
        IdAsalGerbang: 0,
        Golongan: 0,
      },
    ],
    etoll: [
      {
        id: 0,
        Tanggal: "",
        Shift: 0,
        IdGerbang: 0,
        IdGardu: 0,
        IdCabang: 0,
        IdAsalGerbang: 0,
        Golongan: 0,
      },
    ],
    etoll_tunai_flo: [
      {
        id: 0,
        Tanggal: "",
        Shift: 0,
        IdGerbang: 0,
        IdGardu: 0,
        IdCabang: 0,
        IdAsalGerbang: 0,
        Golongan: 0,
      },
    ],
    keseluruhan: [
      {
        id: 0,
        Tanggal: "",
        Shift: 0,
        IdGerbang: 0,
        IdGardu: 0,
        IdCabang: 0,
        IdAsalGerbang: 0,
        Golongan: 0,
      },
    ],
  },
  fetchLalinData: async (payload?: RequestLalinData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getLalinData(payload);
      const responseData = response.data;

      if (responseData.status) {
        set({
          data: responseData.data,
          currentPage: responseData.data.current_page,
          totalPages: responseData.data.total_pages,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          data: null,
          isLoading: false,
          error: responseData.message || "Failed to fetch data",
        });
      }
    } catch (error: unknown) {
      let errorMessage = "General Error";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      set({
        data: null,
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
  },

  setSelectedDate: (date: string | null) => {
    set({ selectedDate: date });
  },

  clearData: () => {
    set({
      data: null,
      currentPage: 1,
      totalPages: 0,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  getRows: () => {
    const state = get();
    return state.data?.rows?.rows || [];
  },

  getTotalCount: () => {
    const state = get();
    return state.data?.count || 0;
  },

  getPaymentSummary: (): PaymentSummary => {
    const rows = get().getRows();
    const summary = rows.reduce<PaymentSummary>(
      (acc, row) => {
        acc.Tunai += row.Tunai ?? 0;
        acc.DinasOpr += row.DinasOpr ?? 0;
        acc.DinasMitra += row.DinasMitra ?? 0;
        acc.DinasKary += row.DinasKary ?? 0;
        acc.eMandiri += row.eMandiri ?? 0;
        acc.eBri += row.eBri ?? 0;
        acc.eBni += row.eBni ?? 0;
        acc.eBca += row.eBca ?? 0;
        acc.eNobu += row.eNobu ?? 0;
        acc.eDKI += row.eDKI ?? 0;
        acc.eMega += row.eMega ?? 0;
        acc.eFlo += row.eFlo ?? 0;

        return acc;
      },
      {
        Tunai: 0,
        DinasOpr: 0,
        DinasMitra: 0,
        DinasKary: 0,
        eMandiri: 0,
        eBri: 0,
        eBni: 0,
        eBca: 0,
        eNobu: 0,
        eDKI: 0,
        eMega: 0,
        eFlo: 0,
        summary: { tunai: 0, ktp: 0, etoll: 0, flo: 0 },
        total: 0,
      },
    );

    summary.summary.tunai = summary.Tunai;
    summary.summary.ktp =
      summary.DinasOpr + summary.DinasMitra + summary.DinasKary;
    summary.summary.etoll =
      summary.eMandiri +
      summary.eBri +
      summary.eBni +
      summary.eBca +
      summary.eNobu +
      summary.eDKI +
      summary.eMega;
    summary.summary.flo = summary.eFlo;
    summary.total =
      summary.summary.tunai +
      summary.summary.ktp +
      summary.summary.etoll +
      summary.summary.flo;

    return summary;
  },

  getTrafficCount: () => {
    const rows = get().getRows();
    const grouped: Record<number, number> = {};
    rows.forEach((row) => {
      const totalRow =
        (row.Tunai ?? 0) +
        (row.DinasOpr ?? 0) +
        (row.DinasMitra ?? 0) +
        (row.DinasKary ?? 0) +
        (row.eMandiri ?? 0) +
        (row.eBri ?? 0) +
        (row.eBni ?? 0) +
        (row.eBca ?? 0) +
        (row.eNobu ?? 0) +
        (row.eDKI ?? 0) +
        (row.eMega ?? 0) +
        (row.eFlo ?? 0);

      grouped[row.IdAsalGerbang] = (grouped[row.IdAsalGerbang] ?? 0) + totalRow;
    });

    return Object.entries(grouped).map(([gerbangId, total]) => ({
      nomorGerbang: `Gerbang ${gerbangId}`,
      total,
    }));
  },
  getShiftCount: () => {
    const rows = get().getRows();

    const counts = { shift1: 0, shift2: 0, shift3: 0 };

    rows.forEach((row) => {
      const totalRow =
        (row.Tunai ?? 0) +
        (row.DinasOpr ?? 0) +
        (row.DinasMitra ?? 0) +
        (row.DinasKary ?? 0) +
        (row.eMandiri ?? 0) +
        (row.eBri ?? 0) +
        (row.eBni ?? 0) +
        (row.eBca ?? 0) +
        (row.eNobu ?? 0) +
        (row.eDKI ?? 0) +
        (row.eMega ?? 0) +
        (row.eFlo ?? 0);

      if (row.Shift === 1) counts.shift1 += totalRow;
      else if (row.Shift === 2) counts.shift2 += totalRow;
      else if (row.Shift === 3) counts.shift3 += totalRow;
    });

    return counts;
  },
  getCabangCount: () => {
    const rows = get().getRows();

    const grouped: Record<number, number> = {};

    rows.forEach((row) => {
      const totalRow =
        (row.Tunai ?? 0) +
        (row.DinasOpr ?? 0) +
        (row.DinasMitra ?? 0) +
        (row.DinasKary ?? 0) +
        (row.eMandiri ?? 0) +
        (row.eBri ?? 0) +
        (row.eBni ?? 0) +
        (row.eBca ?? 0) +
        (row.eNobu ?? 0) +
        (row.eDKI ?? 0) +
        (row.eMega ?? 0) +
        (row.eFlo ?? 0);

      grouped[row.IdCabang] = (grouped[row.IdCabang] ?? 0) + totalRow;
    });

    return Object.entries(grouped).map(([cabangId, total]) => ({
      name: `Ruas ${cabangId}`,
      value: total,
    }));
  },
  getPaymentGroups: (): PaymentGroups => {
    const rows = get().getRows();

    const groups: PaymentGroups = {
      tunai: [],
      flo: [],
      etoll: [],
      ktp: [],
      keseluruhan: [],
      etoll_tunai_flo: [],
    };

    rows.forEach((row) => {
      const minimal: RowDataTable = {
        id: row.id,
        IdCabang: row.IdCabang,
        Tanggal: formatToMMDDYYYY(row.Tanggal),
        Shift: row.Shift,
        IdGardu: row.IdGardu,
        Golongan: row.Golongan,
        IdAsalGerbang: row.IdAsalGerbang,
        Tunai: row?.Tunai ?? 0,
        DinasOpr: row?.DinasOpr ?? 0,
        DinasMitra: row?.DinasMitra ?? 0,
        DinasKary: row?.DinasKary ?? 0,
        eMandiri: row?.eMandiri ?? 0,
        eBri: row?.eBri ?? 0,
        eBni: row?.eBni ?? 0,
        eBca: row?.eBca ?? 0,
        eNobu: row?.eNobu ?? 0,
        eDKI: row?.eDKI ?? 0,
        eMega: row?.eMega ?? 0,
        eFlo: row?.eFlo ?? 0,
      };

      if (row.Tunai && row.Tunai > 0) groups.tunai.push(minimal);
      if (row.eFlo && row.eFlo > 0) groups.flo.push(minimal);

      const etollTotal =
        (row.eMandiri ?? 0) +
        (row.eBri ?? 0) +
        (row.eBni ?? 0) +
        (row.eBca ?? 0) +
        (row.eNobu ?? 0) +
        (row.eDKI ?? 0) +
        (row.eMega ?? 0);

      if (etollTotal > 0) groups.etoll.push(minimal);

      if (
        (row.DinasKary ?? 0) > 0 ||
        (row.DinasOpr ?? 0) > 0 ||
        (row.DinasMitra ?? 0) > 0
      ) {
        groups.ktp.push(minimal);
      }

      groups.keseluruhan.push(minimal);

      if (etollTotal > 0 || (row.Tunai ?? 0) > 0 || (row.eFlo ?? 0) > 0) {
        groups.etoll_tunai_flo.push(minimal);
      }
    });

    return groups;
  },
}));
