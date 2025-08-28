export interface GerbangItem {
  id: number;
  IdCabang: number;
  NamaGerbang: string;
  NamaCabang: string;
  [key: string]: string | number;
}

export interface GerbangCount {
  count: number;
  rows: GerbangItem[];
}

export interface PaginationData {
  total_pages: number;
  current_page: number;
  count: number;
  rows: GerbangCount;
}

export interface ResponseGerbangData {
  status: boolean;
  message: string;
  code: number;
  data: PaginationData;
}

export interface GerbangDetail {
  id: number;
  IdCabang: number;
  NamaGerbang: string;
  NamaCabang: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResponseTambahGerbang {
  status: boolean;
  message: string;
  code: number;
  id: GerbangDetail;
}

export interface ResponseUpdateGerbang {
  id: number;
  IdCabang: number;
  NamaGerbang: string;
  NamaCabang: string;
}
