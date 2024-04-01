export const BASE_URL = "http://192.168.3.8:5000";

export const createConfig = (userToken) => {
  return {
    headers: {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/json",
    },
  };
};
