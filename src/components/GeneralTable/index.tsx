import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  Pagination,
  Stack,
  IconButton,
  styled,
} from "@mui/material";
import { Edit, Delete, Inbox } from "@mui/icons-material";

const Container = styled(Box)({
  width: "100%",
  padding: "24px 0",
});

const HeaderContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 24,
  flexWrap: "wrap",
});

const HeaderTagsContainer = styled(Box)({
  display: "flex",
  gap: 16,
  flexWrap: "wrap",
});

const HeaderTag = styled(Typography)<{ active?: boolean }>(
  ({ active, theme }) => ({
    padding: "8px 16px",
    backgroundColor: active
      ? theme.palette.secondary.main
      : theme.palette.primary.main,
    color: active ? "inherit" : "white",
    borderRadius: 4,
    fontWeight: 500,
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: active
        ? theme.palette.secondary.dark
        : theme.palette.primary.dark,
    },
  }),
);

const ExportButton = styled(Button)({
  textTransform: "none",
});

const StyledTableContainer = styled(TableContainer)({
  marginBottom: 24,
  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.12)",
});

const TableHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: "white",
}));

const NumberCell = styled(TableCell)({
  textAlign: "right",
});

const ActionCell = styled(TableCell)({
  width: 100,
  textAlign: "center",
});

const SummaryRow = styled(TableRow)<{ highlight?: boolean }>(
  ({ highlight, theme }) => ({
    backgroundColor: highlight ? theme.palette.secondary.main : "#e0e0e0",
    "& td": {
      color: highlight ? "white" : "inherit",
      fontWeight: 500,
    },
  }),
);

const SummaryLabel = styled(TableCell)({
  minWidth: 200,
});

const PaginationContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const PaginationControls = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 8,
});

const SelectControl = styled(Select)({
  minWidth: 80,
});

const NoDataContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(8, 2),
  textAlign: "center",
  backgroundColor: "#fafafa",
  borderRadius: theme.shape.borderRadius,
  minHeight: 200,
}));

const NoDataIcon = styled(Inbox)(({ theme }) => ({
  fontSize: 64,
  color: theme.palette.grey[400],
  marginBottom: theme.spacing(2),
}));

const NoDataText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
  marginBottom: theme.spacing(1),
}));

const NoDataSubtext = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[500],
  fontSize: "0.875rem",
}));

export interface TableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  type?: "text" | "number" | "currency" | "date";
  width?: number;
  searchable?: boolean;
  format?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

export interface TabConfig {
  label: string;
  value: string;
  active?: boolean;
}

export interface NoDataConfig {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  showIcon?: boolean;
}

export interface GeneralTableProps {
  tabs?: TabConfig[];
  activeTab?: string;
  onTabChange?: (tabValue: string) => void;
  showExport?: boolean;
  exportFilename?: string;

  columns: TableColumn[];
  data?: Record<string, string | number | undefined>[];
  keyField?: string;

  searchValue?: string;
  onSearchChange?: (searchValue: string) => void;

  summaryData?: Record<string, string | number>[];
  summaryColumns?: TableColumn[];
  summaryHighlightRow?: number;

  pagination?: {
    enabled: boolean;
    page?: number;
    rowsPerPage?: number;
    totalCount?: number;
    onPageChange?: (page: number) => void;
    onRowsPerPageChange?: (rowsPerPage: number) => void;
    rowsPerPageOptions?: number[];
  };

  hover?: boolean;
  size?: "small" | "medium";

  isEditable?: boolean;
  onEdit?: (
    row: Record<string, string | number | undefined>,
    index: number,
  ) => void;
  onDelete?: (
    row: Record<string, string | number | undefined>,
    index: number,
  ) => void;

  noDataConfig?: NoDataConfig;
  loading?: boolean;
}

const convertToCSV = (
  data: Record<string, string | number | undefined>[],
  columns: TableColumn[],
): string => {
  const headers = columns.map((col) => col.label);
  const rows = data.map((row) =>
    columns.map((col) => {
      const value = row[col.key] ?? "";
      if (
        typeof value === "string" &&
        (value.includes(",") || value.includes('"') || value.includes("\n"))
      ) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }),
  );

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
};

const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const searchInData = (
  data: Record<string, string | number | undefined>[],
  searchValue: string,
  columns: TableColumn[],
  searchFields?: string[],
  caseSensitive = false,
): Record<string, string | number | undefined>[] => {
  if (!searchValue.trim()) {
    return data;
  }

  const searchTerm = caseSensitive ? searchValue : searchValue.toLowerCase();

  const fieldsToSearch =
    searchFields ||
    columns.filter((col) => col.searchable !== false).map((col) => col.key);

  return data.filter((row) => {
    return fieldsToSearch.some((field) => {
      const value = row[field];
      if (value === null || value === undefined) return false;

      const stringValue = String(value);
      const searchableValue = caseSensitive
        ? stringValue
        : stringValue.toLowerCase();

      return searchableValue.includes(searchTerm);
    });
  });
};

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const formatValue = (
  value: React.ReactNode | number,
  column: TableColumn,
  row: Record<string, unknown | undefined>,
): React.ReactNode => {
  if (column.format) {
    return column.format(value, row);
  }

  switch (column.type) {
    case "number":
      return typeof value === "number" ? value.toLocaleString() : value;
    case "currency":
      return typeof value === "number" ? `Rp ${value.toLocaleString()}` : value;
    case "date":
      return value instanceof Date ? value.toLocaleDateString() : value;
    default:
      return value;
  }
};

const getCellComponent = (column: TableColumn) => {
  if (column.type === "number" || column.align === "right") {
    return NumberCell;
  }
  return TableCell;
};

const NoDataRow: React.FC<{
  colSpan: number;
  config: NoDataConfig;
}> = ({ colSpan, config }) => (
  <TableRow>
    <TableCell colSpan={colSpan} sx={{ border: 0, p: 0 }}>
      <NoDataContainer>
        {config.showIcon !== false && (config.icon || <NoDataIcon />)}
        <NoDataText variant="h6">{config.title || "Tidak ada data"}</NoDataText>
        <NoDataSubtext variant="body2">
          {config.subtitle || "Belum ada data yang dapat ditampilkan saat ini"}
        </NoDataSubtext>
      </NoDataContainer>
    </TableCell>
  </TableRow>
);

export const GeneralTable: React.FC<GeneralTableProps> = ({
  tabs,
  activeTab,
  onTabChange,
  showExport = false,
  exportFilename,
  columns,
  data = [],
  keyField = "id",
  searchValue: externalSearchValue,
  summaryData,
  summaryColumns,
  summaryHighlightRow,
  pagination,
  hover = true,
  size = "small",
  isEditable = false,
  onEdit,
  onDelete,
  noDataConfig = {},
  loading = false,
}) => {
  const [internalPage, setInternalPage] = useState(0);
  const [internalRowsPerPage, setInternalRowsPerPage] = useState(
    pagination?.rowsPerPageOptions?.[0] || 5,
  );

  const currentSearchValue =
    externalSearchValue !== undefined ? externalSearchValue : "";

  const debouncedSearchValue = useDebounce(currentSearchValue, 300);

  const safeData = Array.isArray(data) ? data : [];

  const filteredData = useMemo(() => {
    if (!debouncedSearchValue) {
      return safeData;
    }

    return searchInData(safeData, debouncedSearchValue, columns);
  }, [safeData, debouncedSearchValue, columns]);

  const hasData = filteredData.length > 0;
  const hasSummaryData = Array.isArray(summaryData) && summaryData.length > 0;

  const isExternalPagination = Boolean(
    pagination?.enabled &&
      pagination?.onPageChange &&
      pagination?.totalCount !== undefined,
  );

  const currentPage = pagination?.page ?? internalPage;
  const currentRowsPerPage = pagination?.rowsPerPage ?? internalRowsPerPage;
  const totalCount = pagination?.totalCount ?? filteredData.length;

  const totalPages = Math.ceil(Math.max(1, totalCount) / currentRowsPerPage);
  const maxPageIndex = Math.max(0, totalPages - 1);
  const safePage = Math.min(Math.max(0, currentPage), maxPageIndex);

  useEffect(() => {
    if (!pagination?.enabled) return;

    const shouldReset = currentPage > maxPageIndex;

    if (shouldReset) {
      if (pagination?.onPageChange) {
        pagination.onPageChange(0);
      } else {
        setInternalPage(0);
      }
    }
  }, [
    activeTab,
    filteredData.length,
    currentRowsPerPage,
    maxPageIndex,
    currentPage,
    pagination?.enabled,
    pagination?.onPageChange,
    debouncedSearchValue,
  ]);

  const handlePageChange = (_event: unknown, newDisplayPage: number) => {
    const newPageIndex = newDisplayPage - 1;

    if (pagination?.onPageChange) {
      pagination.onPageChange(newPageIndex);
    } else {
      setInternalPage(newPageIndex);
    }
  };

  const handleRowsPerPageChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | (Event & { target: { value: unknown; name: string } }),
  ) => {
    const newRowsPerPage = parseInt(
      String((event.target as HTMLInputElement).value),
      10,
    );

    if (pagination?.onRowsPerPageChange) {
      pagination.onRowsPerPageChange(newRowsPerPage);
      if (pagination?.onPageChange) {
        pagination.onPageChange(0);
      }
    } else {
      setInternalRowsPerPage(newRowsPerPage);
      setInternalPage(0);
    }
  };

  const paginatedData = useMemo(() => {
    if (!pagination?.enabled || !hasData) {
      return filteredData;
    }

    if (isExternalPagination) {
      return filteredData;
    }

    const startIndex = safePage * currentRowsPerPage;
    return filteredData.slice(startIndex, startIndex + currentRowsPerPage);
  }, [
    pagination?.enabled,
    isExternalPagination,
    filteredData,
    safePage,
    currentRowsPerPage,
    hasData,
  ]);

  const displayPage = safePage + 1;

  const totalColumns = columns.length + (isEditable ? 1 : 0);

  const handleExportCSV = () => {
    if (!hasData) return;

    const timestamp = new Date().toISOString().split("T")[0];
    const filename = exportFilename || `table-export-${timestamp}`;
    const dataToExport = currentSearchValue ? filteredData : safeData;

    const csvContent = convertToCSV(dataToExport, columns);
    downloadCSV(csvContent, `${filename}.csv`);
  };

  const searchNoDataConfig = currentSearchValue
    ? {
        title: "Tidak ditemukan hasil pencarian",
        subtitle: `Tidak ada data yang sesuai dengan "${currentSearchValue}"`,
        ...noDataConfig,
      }
    : noDataConfig;

  if (loading) {
    return (
      <Container>
        {/* Header with Tabs */}
        {tabs && tabs.length > 0 && (
          <HeaderContainer>
            <HeaderTagsContainer>
              {tabs.map((tab) => (
                <HeaderTag
                  key={tab.value}
                  variant="body2"
                  active={activeTab === tab.value}
                  onClick={() => onTabChange?.(tab.value)}
                >
                  {tab.label}
                </HeaderTag>
              ))}
            </HeaderTagsContainer>
            {showExport && (
              <ExportButton variant="outlined" onClick={handleExportCSV}>
                Export
              </ExportButton>
            )}
          </HeaderContainer>
        )}

        <StyledTableContainer>
          <Paper>
            <Table size={size}>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableHeaderCell
                      key={column.key}
                      align={column.align || "left"}
                      sx={{ minWidth: column.width }}
                    >
                      {column.label}
                    </TableHeaderCell>
                  ))}
                  {isEditable && (
                    <TableHeaderCell align="center">Actions</TableHeaderCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                <NoDataRow
                  colSpan={totalColumns}
                  config={{
                    title: "Memuat data...",
                    subtitle: "Mohon tunggu sebentar",
                    showIcon: false,
                  }}
                />
              </TableBody>
            </Table>
          </Paper>
        </StyledTableContainer>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header with Tabs */}
      {tabs && tabs.length > 0 && (
        <HeaderContainer>
          <HeaderTagsContainer>
            {tabs.map((tab) => (
              <HeaderTag
                key={tab.value}
                variant="body2"
                active={activeTab === tab.value}
                onClick={() => onTabChange?.(tab.value)}
              >
                {tab.label}
              </HeaderTag>
            ))}
          </HeaderTagsContainer>
          {showExport && (
            <ExportButton
              variant="outlined"
              onClick={handleExportCSV}
              disabled={!hasData}
            >
              Export
            </ExportButton>
          )}
        </HeaderContainer>
      )}
      {/* Main Table */}
      <StyledTableContainer>
        <Paper>
          <Table size={size}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableHeaderCell
                    key={column.key}
                    align={column.align || "left"}
                    sx={{ minWidth: column.width }}
                  >
                    {column.label}
                  </TableHeaderCell>
                ))}
                {isEditable && (
                  <TableHeaderCell align="center">Actions</TableHeaderCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {!hasData ? (
                <NoDataRow colSpan={totalColumns} config={searchNoDataConfig} />
              ) : (
                <>
                  {paginatedData.map((row, index) => {
                    const key = row[keyField] ?? `${safePage}-${index}`;
                    const actualIndex = safePage * currentRowsPerPage + index;

                    return (
                      <TableRow key={key} hover={hover}>
                        {columns.map((column) => {
                          const CellComponent = getCellComponent(column);
                          const value = row[column.key];

                          return (
                            <CellComponent
                              key={column.key}
                              align={column.align}
                            >
                              {formatValue(value, column, row)}
                            </CellComponent>
                          );
                        })}
                        {isEditable && (
                          <ActionCell>
                            <IconButton
                              size="small"
                              onClick={() => onEdit?.(row, actualIndex)}
                              color="primary"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => onDelete?.(row, actualIndex)}
                              color="error"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </ActionCell>
                        )}
                      </TableRow>
                    );
                  })}

                  {/* Show empty rows to maintain consistent table height */}
                  {paginatedData.length < currentRowsPerPage &&
                    pagination?.enabled &&
                    Array.from({
                      length: currentRowsPerPage - paginatedData.length,
                    }).map((_, index) => (
                      <TableRow
                        key={`empty-${index}`}
                        style={{ height: size === "small" ? 33 : 53 }}
                      >
                        {columns.map((column) => (
                          <TableCell key={column.key}>&nbsp;</TableCell>
                        ))}
                        {isEditable && <ActionCell>&nbsp;</ActionCell>}
                      </TableRow>
                    ))}
                </>
              )}
            </TableBody>
          </Table>
        </Paper>
      </StyledTableContainer>

      {/* Summary Table */}
      {hasSummaryData && hasData && (
        <StyledTableContainer>
          <Paper>
            <Table size={size}>
              <TableBody>
                {summaryData!.map((row, index) => (
                  <SummaryRow
                    key={index}
                    highlight={index === summaryHighlightRow}
                  >
                    {(summaryColumns || columns).map((column) => {
                      const value = row[column.key];
                      const CellComponent =
                        column.key ===
                        (summaryColumns?.[0]?.key || columns[0].key)
                          ? SummaryLabel
                          : getCellComponent(column);

                      return (
                        <CellComponent key={column.key} align={column.align}>
                          {formatValue(value, column, row)}
                        </CellComponent>
                      );
                    })}
                    {isEditable && <ActionCell>&nbsp;</ActionCell>}
                  </SummaryRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </StyledTableContainer>
      )}

      {/* Pagination - only show if there's data */}
      {hasData && pagination?.enabled && totalPages > 1 && (
        <PaginationContainer>
          <PaginationControls>
            <Typography variant="body2">Show:</Typography>
            <FormControl size="small">
              <SelectControl
                value={currentRowsPerPage}
                onChange={handleRowsPerPageChange}
              >
                {(pagination.rowsPerPageOptions || [5, 10, 25]).map(
                  (option) => (
                    <MenuItem key={option} value={option}>
                      {option} entries
                    </MenuItem>
                  ),
                )}
              </SelectControl>
            </FormControl>
            <Typography variant="body2" sx={{ ml: 2 }}>
              Showing {Math.min(safePage * currentRowsPerPage + 1, totalCount)}{" "}
              to {Math.min((safePage + 1) * currentRowsPerPage, totalCount)} of{" "}
              {totalCount} entries
              {currentSearchValue &&
                ` (filtered from ${safeData.length} total entries)`}
            </Typography>
          </PaginationControls>

          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={displayPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              size="small"
              disabled={totalPages <= 1}
            />
          </Stack>
        </PaginationContainer>
      )}
    </Container>
  );
};
