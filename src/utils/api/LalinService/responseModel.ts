export interface RowData {
  id: number;
  IdCabang: number;
  IdGerbang: number;
  Tanggal: string;
  Shift: number;
  IdGardu: number;
  Golongan: number;
  IdAsalGerbang: number;
  Tunai: number;
  DinasOpr: number;
  DinasMitra: number;
  DinasKary: number;
  eMandiri: number;
  eBri: number;
  eBni: number;
  eBca: number;
  eNobu: number;
  eDKI: number;
  eMega: number;
  eFlo: number;
}

export interface RowsWrapper {
  count: number;
  rows: RowData[];
}

export interface DataResponse {
  total_pages: number;
  current_page: number;
  count: number;
  rows: RowsWrapper;
}

export interface ResponseLalinData {
  status: boolean;
  message: string;
  code: number;
  data: DataResponse;
}

export interface PaymentSummary {
  Tunai: number;
  DinasOpr: number;
  DinasMitra: number;
  DinasKary: number;
  eMandiri: number;
  eBri: number;
  eBni: number;
  eBca: number;
  eNobu: number;
  eDKI: number;
  eMega: number;
  eFlo: number;
  summary: {
    tunai: number;
    ktp: number;
    etoll: number;
    flo: number;
  };
  total: number;
}

export interface TrafficCount {
  nomorGerbang: string;
  total: number;
}

export interface ShiftCount {
  shift1: number;
  shift2: number;
  shift3: number;
}

export interface CabangCount {
  name: string;
  value: number;
}

export interface RowDataTable {
  id: number;
  IdCabang: number;
  Tanggal: string;
  Shift: number;
  IdGardu: number;
  Golongan: number;
  IdAsalGerbang: number;
  Tunai?: number;
  DinasOpr?: number;
  DinasMitra?: number;
  DinasKary?: number;
  eMandiri?: number;
  eBri?: number;
  eBni?: number;
  eBca?: number;
  eNobu?: number;
  eDKI?: number;
  eMega?: number;
  eFlo?: number;
  [key: string]: string | number | undefined;
}

export interface PaymentGroups {
  tunai: RowDataTable[];
  flo: RowDataTable[];
  etoll: RowDataTable[];
  ktp: RowDataTable[];
  keseluruhan: RowDataTable[];
  etoll_tunai_flo: RowDataTable[];
}
