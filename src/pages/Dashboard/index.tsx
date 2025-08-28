import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { Users, CreditCard, MapPin, Activity } from "lucide-react";
import { styled, keyframes } from "@mui/material/styles";
import PageWrapper from "../../components/PageWrapper";
import FilterCard from "../../components/Filter";
import { useLalin } from "../../stores/lalin/hooks.ts";
import type {
  CabangCount,
  TrafficCount,
} from "../../utils/api/LalinService/responseModel.ts";

interface MetricCardData {
  title: string;
  value: number;
  percentage: string;
  trend: "up" | "down";
  icon: React.ComponentType;
  color: string;
}
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const Card = styled("div")({
  padding: "24px",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 8px 32px rgba(35, 65, 127, 0.1)",
  border: "1px solid #f2c20fff",
  height: "100%",
  animation: `${fadeIn} 0.6s ease-out`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 40px rgba(35, 65, 127, 0.15)",
  },
});

const MetricCard = styled("div")<{ color: string }>(({ color }) => ({
  padding: "20px",
  background: `linear-gradient(135deg, ${color}15, ${color}05)`,
  borderRadius: "12px",
  border: `2px solid ${color}30`,
  height: "100%",
  animation: `${slideIn} 0.6s ease-out`,
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: `0 8px 25px ${color}25`,
  },
}));

const MetricHeader = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "12px",
});

const MetricTitle = styled("h4")({
  fontSize: "14px",
  fontWeight: 500,
  color: "#6b7280",
  margin: 0,
});

const MetricValue = styled("div")({
  fontSize: "24px",
  fontWeight: 700,
  color: "#23417fff",
  marginBottom: "8px",
  animation: `${pulse} 2s infinite`,
});

const MetricChange = styled("div")<{ trend: "up" | "down" }>(({ trend }) => ({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "12px",
  fontWeight: 600,
  color: trend === "up" ? "#10b981" : "#ef4444",
}));

const IconWrapper = styled("div")<{ color: string }>(({ color }) => ({
  padding: "8px",
  borderRadius: "8px",
  backgroundColor: `${color}20`,
  color: color,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const CardTitle = styled("h3")({
  fontSize: "18px",
  fontWeight: 600,
  color: "#23417fff",
  marginBottom: "16px",
  textAlign: "center",
});

const GridLayout = styled("div")({
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "24px",
  marginTop: "24px",
});

const MetricsGrid = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "16px",
  marginBottom: "24px",
});

const Column = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

const WelcomeCard = styled("div")({
  background: "linear-gradient(135deg, #23417fff, #3b82f6)",
  borderRadius: "16px",
  padding: "24px",
  color: "white",
  marginBottom: "24px",
  animation: `${fadeIn} 0.8s ease-out`,
});

const WelcomeTitle = styled("h2")({
  fontSize: "24px",
  fontWeight: 700,
  margin: "0 0 8px 0",
});

const WelcomeSubtitle = styled("p")({
  fontSize: "14px",
  opacity: 0.9,
  margin: 0,
});

const PieLegendWrapper = styled("div")({
  marginTop: "16px",
});

const PieLegendTitle = styled("h3")({
  fontSize: "14px",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "8px",
});

const PieLegendList = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

const PieLegendItem = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "4px",
  borderRadius: "4px",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "#f9fafb",
    transform: "translateX(4px)",
  },
});

const PieLegendColor = styled("div")<{ bgcolor: string }>(({ bgcolor }) => ({
  width: "12px",
  height: "12px",
  backgroundColor: bgcolor,
  borderRadius: "2px",
}));

const PieLegendText = styled("span")({
  fontSize: "12px",
  color: "#6b7280",
});

interface PayloadItem {
  value?: number | string;
  name?: string;
  [key: string]: unknown;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string | number;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "white",
          padding: "12px",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p style={{ margin: "0 0 4px 0", fontWeight: 600, color: "#23417fff" }}>
          {`${label}`}
        </p>
        <p style={{ margin: 0, color: "#6b7280" }}>
          {`Jumlah: ${payload[0].value}`}
        </p>
      </div>
    );
  }
};

const MetricCardComponent: React.FC<{
  data: MetricCardData;
  index: number;
}> = ({ data, index }) => {
  const Icon = data.icon;

  return (
    <MetricCard
      color={data.color}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <MetricHeader>
        <MetricTitle>{data.title}</MetricTitle>
        <IconWrapper color={data.color}>
          <Icon />
        </IconWrapper>
      </MetricHeader>
      <MetricValue>{data.value}</MetricValue>
      <MetricChange trend={data.trend}>{data.percentage}</MetricChange>
    </MetricCard>
  );
};

const PieChartLegend: React.FC<{
  data: { name: string; value: number }[];
  title: string;
}> = ({ data, title }) => {
  const COLORS: string[] = [
    "#23417fff",
    "#f2c20fff",
    "#6366f1",
    "#8b5cf6",
    "#06b6d4",
  ];

  return (
    <PieLegendWrapper>
      <PieLegendTitle>{title}</PieLegendTitle>
      <PieLegendList>
        {data.map((entry, index) => (
          <PieLegendItem key={entry.name}>
            <PieLegendColor bgcolor={COLORS[index % COLORS.length]} />
            <PieLegendText>
              {entry.name}: {entry.value}
            </PieLegendText>
          </PieLegendItem>
        ))}
      </PieLegendList>
    </PieLegendWrapper>
  );
};

const Dashboard: React.FC = () => {
  const [date, setDate] = useState<{ dateFilter: string } | null>(null);
  const {
    paymentSummaryData,
    refetchData,
    trafficSummaryData,
    shiftSummaryData,
    cabangSummaryData,
    fetchDataWithDate,
  } = useLalin();

  useEffect(() => {
    refetchData();
  }, []);

  useEffect(() => {
    if (date) {
      fetchDataWithDate(date.dateFilter).then();
    }
  }, [date]);

  const metricsData: MetricCardData[] = [
    {
      title: "Tunai",
      value: paymentSummaryData.summary.tunai,
      percentage:
        paymentSummaryData && paymentSummaryData.total
          ? `${(paymentSummaryData.summary.tunai / paymentSummaryData.total) * 100}%`
          : "0%",
      trend:
        paymentSummaryData.summary.tunai / paymentSummaryData.total > 0.5
          ? "up"
          : "down",
      icon: CreditCard,
      color: "#10b981",
    },
    {
      title: "KTP",
      value: paymentSummaryData.summary.ktp,
      percentage:
        paymentSummaryData && paymentSummaryData.total
          ? `${(paymentSummaryData.summary.ktp / paymentSummaryData.total) * 100}%`
          : "0%",
      trend:
        paymentSummaryData.summary.ktp / paymentSummaryData.total > 0.5
          ? "up"
          : "down",
      icon: Users,
      color: "#3b82f6",
    },
    {
      title: "E-Toll",
      value: paymentSummaryData.summary.etoll,
      percentage:
        paymentSummaryData && paymentSummaryData.total
          ? `${(paymentSummaryData.summary.etoll / paymentSummaryData.total) * 100}%`
          : "0%",
      trend:
        paymentSummaryData.summary.etoll / paymentSummaryData.total > 0.5
          ? "up"
          : "down",
      icon: MapPin,
      color: "#f59e0b",
    },
    {
      title: "Flo",
      value: paymentSummaryData.summary.flo,
      percentage:
        paymentSummaryData && paymentSummaryData.total
          ? `${(paymentSummaryData.summary.flo / paymentSummaryData.total) * 100}%`
          : "0%",
      trend:
        paymentSummaryData.summary.flo / paymentSummaryData.total > 0.5
          ? "up"
          : "down",
      icon: Activity,
      color: "#8b5cf6",
    },
  ];

  const bankData = [
    { name: "BCA", value: paymentSummaryData.eBca },
    { name: "BRI", value: paymentSummaryData.eBri },
    { name: "BNI", value: paymentSummaryData.eBni },
    { name: "DKI", value: paymentSummaryData.eDKI },
    { name: "Mandiri", value: paymentSummaryData.eMandiri },
    { name: "Flo", value: paymentSummaryData.summary.flo },
    { name: "KTP", value: paymentSummaryData.summary.ktp },
  ];

  const gerbangData: TrafficCount[] = trafficSummaryData;

  const shiftData: { name: string; value: number }[] = [
    { name: "Shift 1", value: shiftSummaryData.shift1 },
    { name: "Shift 2", value: shiftSummaryData.shift2 },
    { name: "Shift 3", value: shiftSummaryData.shift3 },
  ];

  const ruasData: CabangCount[] = cabangSummaryData;

  const COLORS: string[] = [
    "#23417fff",
    "#f2c20fff",
    "#6366f1",
    "#8b5cf6",
    "#06b6d4",
  ];

  return (
    <PageWrapper title="Dashboard">
      {/* Welcome Card */}
      <WelcomeCard>
        <WelcomeTitle>Selamat Datang di Dashboard Lalu Lintas!</WelcomeTitle>
        <WelcomeSubtitle>
          Monitor transaksi dan data lalu lintas
        </WelcomeSubtitle>
      </WelcomeCard>

      {/* Metrics Cards */}
      <MetricsGrid>
        {metricsData.map((metric, index) => (
          <MetricCardComponent key={metric.title} data={metric} index={index} />
        ))}
      </MetricsGrid>

      {/* Filter Section */}
      <FilterCard showDateInput onFilter={setDate} />

      {/* Main Grid */}
      <GridLayout>
        <Column>
          <Card style={{ height: "350px" }}>
            <CardTitle>📊 Data Pembayaran</CardTitle>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={bankData}
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  label={{
                    value: "Jumlah Lalin",
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      textAnchor: "middle",
                      fontSize: "12px",
                      fill: "#6b7280",
                    },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill="#23417fff"
                  radius={[4, 4, 0, 0]}
                  cursor="pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card style={{ height: "350px" }}>
            <CardTitle>🚪 Data Gerbang</CardTitle>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={gerbangData}
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="nomorGerbang"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  label={{
                    value: "Jumlah Lalin",
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      textAnchor: "middle",
                      fontSize: "12px",
                      fill: "#6b7280",
                    },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="total"
                  fill="#f2c20fff"
                  radius={[4, 4, 0, 0]}
                  cursor="pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Column>

        <Column>
          <Card>
            <CardTitle>⏰ Data Shift</CardTitle>
            <div style={{ height: "200px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={shiftData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {shiftData.map((_, index) => (
                      <Cell
                        key={`shift-cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <PieChartLegend data={shiftData} title="Total Lalin" />
          </Card>

          <Card>
            <CardTitle>🛣️ Data Ruas</CardTitle>
            <div style={{ height: "200px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ruasData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {ruasData.map((_, index) => (
                      <Cell
                        key={`ruas-cell-${index}`}
                        fill={COLORS[(index + 2) % COLORS.length]}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <PieChartLegend data={ruasData} title="Total Ruas" />
          </Card>
        </Column>
      </GridLayout>
    </PageWrapper>
  );
};

export default Dashboard;
