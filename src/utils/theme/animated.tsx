import { keyframes, styled } from "@mui/material/styles";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// eslint-disable-next-line react-refresh/only-export-components
export const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const AnimatedTableWrapper = styled("div")({
  "& .MuiTabs-root": {
    animation: `${fadeInUp} 0.5s ease-out 0.6s both`,
  },
  "& .MuiTableContainer-root": {
    animation: `${fadeInUp} 0.6s ease-out 0.8s both`,
  },

  "& .MuiTableHead-root .MuiTableRow-root": {
    animation: `${slideInLeft} 0.5s ease-out 0.7s both`,
  },
});

export const FloatingElements = styled("div")({
  width: "100%",
  "& .MuiButton-root": {
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      transform: "translateY(-2px) scale(1.02)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    },
  },
});

export const AnimatedFilterCard = styled("div")({
  animation: `${slideInLeft} 0.6s ease-out 0.2s both`,
});

export const LoadingShimmer = styled("div")({
  width: "100%",
  height: "20px",
  background: `linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)`,
  backgroundSize: "200px 100%",
  animation: `${shimmer} 1.5s infinite`,
  borderRadius: "4px",
  marginBottom: "8px",
});
