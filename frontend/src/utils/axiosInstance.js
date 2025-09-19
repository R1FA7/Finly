import axios from 'axios'
import { API_PATHS } from './apiPaths'
import { VITE_BACKEND_URL } from './constants'


const axiosInstance = axios.create({
  baseURL: VITE_BACKEND_URL,
  headers:{
    "Content-Type": "application/json"
  },
  withCredentials: true,
})

//Request Interceptor : Attach token

axiosInstance.interceptors.request.use(
  (config)=>{
    const token = localStorage.getItem("access_token")
    if(token){
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error)=> Promise.reject(error)
)

//Resonpose Interceptor : catch 401 and renew/ refresh access token

// axiosInstance.interceptors.response.use(
//   (response)=>{
//     return response;
//   },
//   async (error)=>{
//     const originalRequest = error.config 

//     if(error.response?.status===401 && !originalRequest._retry && !originalRequest.url.includes(API_PATHS.AUTH.REFRESH_ACCESS_TOKEN)){//first time 401 error
//       originalRequest._retry=true 
//       try{
//         const {data} = await axiosInstance.post(API_PATHS.AUTH.REFRESH_ACCESS_TOKEN,{},{
//           withCredentials:true
//         });

//         if(data.access_token){
//           localStorage.setItem("access_token", data.access_token)
//           originalRequest.headers.Authorization = `Bearer ${data.access_token}`

//           return axiosInstance(originalRequest)
//         }
//       } catch(err){
//         console.error("Refresh token failed",err)
//         window.location.href='/login'
//       }
//     }
//     if (error.response) {
//       if (error.response.status === 401) {
//         // Prevent redirect loops by checking current path
//         if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
//           window.location.href = "/login";
//         }
//       } else if (error.response.status === 500) {
//         console.error("Server error. Please try again later");
//       }
//     }
//     return Promise.reject(error)
//   }
// )
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes(API_PATHS.AUTH.REFRESH_ACCESS_TOKEN)
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await axiosInstance.post(API_PATHS.AUTH.REFRESH_ACCESS_TOKEN, {}, { withCredentials: true });

        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        console.error("Refresh token failed", err);
        localStorage.removeItem("access_token");
        if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
          window.location.href = '/login';
        }
        return Promise.reject(err);
      }
    }

    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("access_token");
        if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
          window.location.href = "/login";
        }
      } else if (error.response.status === 500) {
        console.error("Server error. Please try again later");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timed out. Please try again.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance