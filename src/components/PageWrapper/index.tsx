import { styled } from "@mui/material/styles";
import React from "react";

interface PageWrapperProps {
  children?: React.ReactNode;
  title?: string;
  className?: string;
}

const PageContainer = styled("div")({
  padding: "1px 20px 24px",
  backgroundColor: "white",
  borderRadius: "10px",
  boxShadow: "0 8px 32px rgba(35, 65, 127, 0.1)",
});

const PageTitle = styled("h1")({
  fontSize: "32px",
  fontWeight: "bold",
  color: "#23417fff",
  marginBottom: "24px",
  textAlign: "left",
});

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  title,
  className,
}) => {
  return (
    <PageContainer className={className}>
      {title && <PageTitle>{title}</PageTitle>}
      {children}
    </PageContainer>
  );
};

export default PageWrapper;
