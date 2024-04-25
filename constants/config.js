// prod server smooth Algo
// export const BASE_URL = "http://192.168.3.150:3030";

export const BASE_URL = "http://192.168.2.6:3030";

export const createConfig = (userToken) => {
  return {
    headers: {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': '*'
    },
  };
};

