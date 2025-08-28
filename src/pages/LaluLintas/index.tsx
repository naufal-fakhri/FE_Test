import { useEffect, useState } from "react";
import {
  GeneralTable,
  type TabConfig,
  type TableColumn,
} from "../../components/GeneralTable";
import { useLalin } from "../../stores/lalin/hooks.ts";
import PageWrapper from "../../components/PageWrapper";
import FilterCard from "../../components/Filter";
import { styled } from "@mui/material/styles";
import { Paper } from "@mui/material";
import {
  AnimatedFilterCard,
  AnimatedTableWrapper,
  FloatingElements,
  LoadingShimmer,
  scaleIn,
} from "../../utils/theme/animated.tsx";

const Card = styled(Paper)({
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 8px 32px rgba(35, 65, 127, 0.1)",
  border: "1px solid #f2c20f",
  height: "100%",
  marginTop: "24px",
  animation: `${scaleIn} 0.7s ease-out 0.4s both`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 40px rgba(35, 65, 127, 0.15)",
  },
});

const LoadingContainer = styled("div")({
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

export default function LaluLintasTable() {
  const [activeTab, setActiveTab] = useState("etoll");
  const [date, setDate] = useState<{ dateFilter: string } | null>(null);

  const {
    refetchData,
    paymentGroups,
    isLoading,
    cabangSummaryData,
    fetchDataWithDate,
  } = useLalin();

  type TabKey =
    | "etoll"
    | "tunai"
    | "ktp"
    | "keseluruhan"
    | "etoll_tunai_flo"
    | "flo";

  const dataShowTable: Record<TabKey, typeof paymentGroups.etoll> = {
    etoll: paymentGroups.etoll,
    tunai: paymentGroups.tunai,
    ktp: paymentGroups.ktp,
    flo: paymentGroups.flo,
    keseluruhan: paymentGroups.keseluruhan,
    etoll_tunai_flo: paymentGroups.etoll_tunai_flo,
  };

  const currentData = dataShowTable[activeTab as TabKey];
  const summaryData = [
    {
      label: "Total Lalu Lintas Ruas 16",
      total: cabangSummaryData[0]?.value,
    },
    {
      label: "Total Lalu Lintas Keseluruhan",
      total: cabangSummaryData[0]?.value,
    },
  ];

  const baseColumns: TableColumn[] = [
    { key: "id", label: "ID", width: 60 },
    { key: "IdCabang", label: "Ruas", width: 100 },
    { key: "IdAsalGerbang", label: "Asal Gerbang", width: 120 },
    { key: "IdGardu", label: "Gardu", width: 80 },
    { key: "Tanggal", label: "Tanggal", width: 120 },
    { key: "Shift", label: "Shift", width: 80 },
    { key: "Golongan", label: "Golongan", width: 100 },
  ];

  const tabColumnsMap: Record<TabKey, TableColumn[]> = {
    etoll: [
      { key: "eBri", label: "eBri", width: 100 },
      { key: "eBni", label: "eBni", width: 100 },
      { key: "eBca", label: "eBca", width: 100 },
      { key: "eNobu", label: "eNobu", width: 100 },
      { key: "eDKI", label: "eDKI", width: 100 },
      { key: "eMega", label: "eMega", width: 100 },
    ],
    tunai: [{ key: "Tunai", label: "Tunai", width: 100 }],
    ktp: [
      { key: "DinasOpr", label: "Dinas Opr", width: 100 },
      { key: "DinasMitra", label: "Dinas Mitra", width: 120 },
      { key: "DinasKary", label: "Dinas Kary", width: 120 },
    ],
    keseluruhan: [
      { key: "eBri", label: "eBri", width: 100 },
      { key: "eBni", label: "eBni", width: 100 },
      { key: "eBca", label: "eBca", width: 100 },
      { key: "eNobu", label: "eNobu", width: 100 },
      { key: "eDKI", label: "eDKI", width: 100 },
      { key: "eMega", label: "eMega", width: 100 },
      { key: "DinasOpr", label: "Dinas Opr", width: 100 },
      { key: "DinasMitra", label: "Dinas Mitra", width: 120 },
      { key: "DinasKary", label: "Dinas Kary", width: 120 },
      { key: "eFlo", label: "Flo", width: 100 },
    ],
    etoll_tunai_flo: [
      { key: "eBri", label: "eBri", width: 100 },
      { key: "eBni", label: "eBni", width: 100 },
      { key: "eBca", label: "eBca", width: 100 },
      { key: "eNobu", label: "eNobu", width: 100 },
      { key: "eDKI", label: "eDKI", width: 100 },
      { key: "eMega", label: "eMega", width: 100 },
      { key: "eFlo", label: "Flo", width: 100 },
    ],
    flo: [{ key: "eFlo", label: "Flo", width: 100 }],
  };

  function getColumnsForTab(tab: TabKey): TableColumn[] {
    return [...baseColumns, ...(tabColumnsMap[tab] || [])];
  }
  const selectedTab: TabKey = activeTab as TabKey;
  const columns = getColumnsForTab(selectedTab);

  const summaryColumns: TableColumn[] = [
    { key: "label", label: "Label" },
    { key: "total", label: "Total", type: "number" },
  ];

  const tabs: TabConfig[] = [
    { label: "Total E-Toll", value: "etoll" },
    { label: "Total Tunal", value: "tunal" },
    { label: "Total Flo", value: "flo" },
    { label: "Total KTP", value: "ktp" },
    { label: "Total Keseluruhan", value: "keseluruhan" },
    { label: "Total E-Toll+Tunal+Flo", value: "etoll_tunai_flo" },
  ];

  useEffect(() => {
    refetchData();
  }, []);

  useEffect(() => {
    if (date) {
      fetchDataWithDate(date.dateFilter).then();
    }
  }, [date]);

  const LoadingTable = () => (
    <LoadingContainer>
      {Array.from({ length: 8 }).map((_, index) => (
        <LoadingShimmer
          key={index}
          style={{
            animationDelay: `${index * 0.1}s`,
            height: index === 0 ? "30px" : "20px",
            opacity: index === 0 ? 0.9 : 0.7,
          }}
        />
      ))}
    </LoadingContainer>
  );

  return (
    <PageWrapper title={"Data Lalu Lintas"}>
      <AnimatedFilterCard>
        <FilterCard showDateInput onFilter={setDate} />
      </AnimatedFilterCard>
      <Card>
        <FloatingElements>
          <AnimatedTableWrapper>
            {isLoading ? (
              <LoadingTable />
            ) : (
              <GeneralTable
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                showExport={true}
                columns={columns}
                data={currentData}
                keyField="no"
                summaryData={summaryData}
                summaryColumns={summaryColumns}
                summaryHighlightRow={1}
                pagination={{
                  enabled: true,
                  rowsPerPageOptions: [5, 10, 15],
                }}
                hover={true}
                size="small"
              />
            )}
          </AnimatedTableWrapper>
        </FloatingElements>
      </Card>
    </PageWrapper>
  );
}
