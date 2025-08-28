export const localhostAPIUrl = "http://localhost:8080";
export const developmentAPIUrl = "";
export const productionAPIUrl = "http://localhost:8080";

export const getApiUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return productionAPIUrl;
  }
  return localhostAPIUrl;
};
