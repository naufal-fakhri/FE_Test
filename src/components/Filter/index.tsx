import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  TextField,
  Button as MuiButton,
  InputAdornment,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Search, Calendar } from "lucide-react";

interface FilterCardProps {
  onFilter?: (filters: FilterData) => void;
  initialDateFilter?: string;
  initialSearchText?: string;
  placeholder?: string;
  showSearchInput?: boolean;
  showDateInput?: boolean;
  buttonText?: string;
  className?: string;
}

interface FilterData {
  dateFilter: string;
  searchText: string;
}

const Card = styled(Paper)(() => ({
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 8px 32px rgba(35, 65, 127, 0.1)",
  border: "1px solid #f2c20f",
  height: "100%",
}));

const Container = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

const FilterContainer = styled(Box)(() => ({
  display: "flex",
  gap: "16px",
  alignItems: "center",
  flexWrap: "wrap",
}));

const StyledTextField = styled(TextField)(() => ({
  width: "250px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontSize: "14px",
    "& input": {
      padding: "12px 16px",
    },
  },
}));

const Button = styled(MuiButton)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 24px",
  backgroundColor: theme.palette.primary.main,
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 500,
  textTransform: "none",
  minWidth: "120px",
  "&:hover": {
    backgroundColor: "#1565c0",
  },
  "&:disabled": {
    backgroundColor: "#e0e0e0",
    color: "#9e9e9e",
  },
}));

const FilterCard: React.FC<FilterCardProps> = ({
  onFilter,
  initialDateFilter = "",
  initialSearchText = "",
  placeholder = "Search...",
  showSearchInput = false,
  showDateInput = false,
  buttonText = "Apply",
  className,
}) => {
  const [dateFilter, setDateFilter] = useState<string>(initialDateFilter);
  const [searchText, setSearchText] = useState<string>(initialSearchText);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFilter = async (): Promise<void> => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const filterData: FilterData = { dateFilter, searchText };

    if (onFilter) {
      onFilter(filterData);
    } else {
      console.log("Filter clicked:", filterData);
    }

    setIsLoading(false);
  };

  return (
    <Card className={className}>
      <Container>
        <FilterContainer>
          <Typography>Filter Data :</Typography>
          {showDateInput && (
            <StyledTextField
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Calendar size={16} color="#9e9e9e" />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {showSearchInput && (
            <StyledTextField
              type="text"
              placeholder={placeholder}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="#9e9e9e" />
                  </InputAdornment>
                ),
              }}
            />
          )}
        </FilterContainer>
        <Button onClick={handleFilter} variant="contained" disabled={isLoading}>
          {isLoading ? (
            <>
              <CircularProgress size={16} color="inherit" />
              Loading...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </Container>
    </Card>
  );
};

export default FilterCard;
export type { FilterCardProps, FilterData };
