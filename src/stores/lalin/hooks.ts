import type { RequestLalinData } from "../../utils/api/LalinService/requestModel.ts";
import { useLalinStore } from "./index.ts";

export const useLalin = () => {
  const {
    data,
    isLoading,
    error,
    currentPage,
    totalPages,
    selectedDate,
    fetchLalinData,
    setCurrentPage,
    setSelectedDate,
    clearData,
    clearError,
    getRows,
    getTotalCount,
    getPaymentSummary,
    getTrafficCount,
    getShiftCount,
    getCabangCount,
    getPaymentGroups,
  } = useLalinStore();

  const refetchData = async () => {
    if (selectedDate) {
      await fetchLalinData({ tanggal: selectedDate } as RequestLalinData);
    } else {
      await fetchLalinData();
    }
  };

  const fetchDataWithDate = async (date: string) => {
    await fetchLalinData({ tanggal: date } as RequestLalinData);
  };

  const clearAll = () => {
    clearData();
    setSelectedDate(null);
  };

  return {
    data,
    rows: getRows(),
    isLoading,
    error,
    currentPage,
    totalPages,
    selectedDate,
    totalCount: getTotalCount(),
    paymentSummaryData: getPaymentSummary(),
    trafficSummaryData: getTrafficCount(),
    shiftSummaryData: getShiftCount(),
    cabangSummaryData: getCabangCount(),
    paymentGroups: getPaymentGroups(),
    refetchData,
    fetchDataWithDate,
    setCurrentPage,
    setSelectedDate,
    clearData: clearAll,
    clearError,
    getPaymentSummary,
    getTrafficCount,
    getShiftCount,
    getCabangCount,
    getPaymentGroups,
    hasData: getRows().length > 0,
    isEmpty: !isLoading && getRows().length === 0,
  };
};
