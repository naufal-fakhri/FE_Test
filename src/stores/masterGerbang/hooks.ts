import { useGerbangStore } from "./index.ts";

export const useGerbang = () => {
  const {
    data,
    isLoading,
    error,
    fetchGerbangData,
    clearData,
    clearError,
    deleteGerbang,
    addGerbang,
    updateGerbang,
  } = useGerbangStore();

  const refetchData = async () => {
    await fetchGerbangData();
  };

  const clearAll = () => {
    clearData();
    clearError();
  };

  return {
    data,
    isLoading,
    error,

    refetchData,
    clearData: clearAll,
    deleteGerbang,
    addGerbang,
    updateGerbang,
  };
};
