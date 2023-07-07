// const axios = require('axios');
// // const { getSession } = require('next-auth/client');

// const axiosInstance = axios.create();

// axiosInstance.interceptors.request.use(async (config) => {
//   const session = await getSession();
//   if (session && session.accessToken) {
//     config.headers.Authorization = `Bearer ${session.accessToken}`;
//   }
//   return config;
// });

// // module.exports = axiosInstance;
