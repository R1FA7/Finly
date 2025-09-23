// import axios from 'axios'
// import { API_PATHS } from './apiPaths'

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URL,
//   headers:{
//     "Content-Type": "application/json"
//   },
//   withCredentials: true,
// })

// //Request Interceptor : Attach token

// axiosInstance.interceptors.request.use(
//   (config)=>{
//     const token = localStorage.getItem("access_token")
//     if(token){
//       config.headers['Authorization'] = `Bearer ${token}`
//     }
//     return config
//   },
//   (error)=> Promise.reject(error)
// )
// //Add a flag & queue system to avoid multiple refresh calls

// let isRefreshing = false;
// let refreshQueue = []

// function  queueFailedRequest(config){
//   return new Promise((resolve,reject)=>{
//     refreshQueue.push({resolve, reject, config})
//   })
// }

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if(error.response && error.response.status===401){
//       if(!isRefreshing){
//         isRefreshing=true
//         try {
//           const {data} = await axiosInstance.post(API_PATHS.AUTH.REFRESH_ACCESS_TOKEN,{},{withCredentials:true})
//           const newAccessToken = data.access_token
//           error.config.headers['Authorization'] = `Bearer ${newAccessToken}`

//           refreshQueue.forEach(({config, resolve, reject})=>{
//             axiosInstance
//               .request(config)
//               .then((response)=>resolve(response))
//               .catch((err)=>reject(err))
//           })

//           refreshQueue=[]

//           return axiosInstance(originalRequest)

//         } catch (refreshError) {
//           throw Promise.reject(refreshError);
//         } finally{
//           isRefreshing=false
//         }
//       }
//       return queueFailedRequest(originalRequest)
//     }
//     return Promise.reject(error)
//   }
// )


// //Resonpose Interceptor : catch 401 and renew/ refresh access token

// // axiosInstance.interceptors.response.use(
// //   (response) => {
// //     return response;
// //   },
// //   async (error) => {
// //     const originalRequest = error.config;
// //     if (error.response?.status === 401 && originalRequest.url.includes('/refresh-token')) {
// //       window.location.href = '/';
// //       return Promise.reject(error);
// //     }
// //     if (error.response?.status === 401 && !originalRequest._retry) { // first time 401 error
// //       originalRequest._retry = true;
// //       try {
// //         const { data } = await axiosInstance.post(
// //           API_PATHS.AUTH.REFRESH_ACCESS_TOKEN,
// //           {},
// //           { withCredentials: true }
// //         );

// //         if (data.access_token) {
// //           localStorage.setItem("access_token", data.access_token);
// //           originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
// //           return axiosInstance(originalRequest);
// //         }
// //       } catch (err) {
// //         console.error("Refresh token failed", err);
// //         window.location.href = '/login';
// //       }
// //     }

// //     if (error.response) {
// //       if (error.response.status === 401 && originalRequest._retry) {
// //         // only redirect after refresh attempt failed
// //         localStorage.removeItem("access_token");
// //         window.location.href = "/";
// //       } else if (error.response.status === 500) {
// //         console.error("Server error. Please try again later");
// //       } else if(error.code==="ECONNABORTED"){
// //         console.error("Request timed out. Please try again.");
// //       }
// //     }
// //     return Promise.reject(error);
// //   }
// // );


// // axiosInstance.interceptors.response.use(
// //   (response)=>{
// //     return response;
// //   },
// //   async (error)=>{
// //     const originalRequest = error.config 

// //     if(error.response?.status===401 && !originalRequest._retry && !originalRequest.url.includes(API_PATHS.AUTH.REFRESH_ACCESS_TOKEN)){//first time 401 error
// //       originalRequest._retry=true 
// //       try{
// //         const {data} = await axiosInstance.post(API_PATHS.AUTH.REFRESH_ACCESS_TOKEN,{},{
// //           withCredentials:true
// //         });

// //         if(data.access_token){
// //           localStorage.setItem("access_token", data.access_token)
// //           originalRequest.headers.Authorization = `Bearer ${data.access_token}`

// //           return axiosInstance(originalRequest)
// //         }
// //       } catch(err){
// //         console.error("Refresh token failed",err)
// //         window.location.href='/login'
// //       }
// //     }
// //     if (error.response) {
// //       if (error.response.status === 401) {
// //         // Prevent redirect loops by checking current path
// //         if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
// //           window.location.href = "/login";
// //         }
// //       } else if (error.response.status === 500) {
// //         console.error("Server error. Please try again later");
// //       }
// //     }
// //     return Promise.reject(error)
// //   }
// // )
// // axiosInstance.interceptors.response.use(
// //   response => response,
// //   async error => {
// //     const originalRequest = error.config;

// //     if (
// //       error.response?.status === 401 &&
// //       !originalRequest._retry &&
// //       !originalRequest.url.includes(API_PATHS.AUTH.REFRESH_ACCESS_TOKEN)
// //     ) {
// //       originalRequest._retry = true;

// //       try {
// //         const { data } = await axiosInstance.post(API_PATHS.AUTH.REFRESH_ACCESS_TOKEN, {}, { withCredentials: true });

// //         if (data.access_token) {
// //           localStorage.setItem("access_token", data.access_token);
// //           originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
// //           return axiosInstance(originalRequest);
// //         }
// //       } catch (err) {
// //         console.error("Refresh token failed", err);
// //         localStorage.removeItem("access_token");
// //         if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
// //           window.location.href = '/login';
// //         }
// //         return Promise.reject(err);
// //       }
// //     }

// //     if (error.response) {
// //       if (error.response.status === 401) {
// //         localStorage.removeItem("access_token");
// //         if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
// //           window.location.href = "/login";
// //         }
// //       } else if (error.response.status === 500) {
// //         console.error("Server error. Please try again later");
// //       }
// //     } else if (error.code === "ECONNABORTED") {
// //       console.error("Request timed out. Please try again.");
// //     }

// //     return Promise.reject(error);
// //   }
// // );

// export default axiosInstance

import axios from 'axios'
import { API_PATHS } from './apiPaths'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true,
})

// Request Interceptor: Attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add a flag & queue system to avoid multiple refresh calls
let isRefreshing = false;
let refreshQueue = [];

// Function to process queued requests
function processQueue(error, token = null) {
  refreshQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      config.headers['Authorization'] = `Bearer ${token}`;
      resolve(axiosInstance(config));
    }
  });
  
  refreshQueue = [];
}

// Response Interceptor: Handle 401 and refresh tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a 401 error and not already a retry attempt
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If it's the refresh token endpoint that failed, redirect to login
      if (originalRequest.url?.includes('/refresh-token')) {
        localStorage.removeItem("access_token");
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // If already refreshing, add to queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const { data } = await axiosInstance.post(
          API_PATHS.AUTH.REFRESH_ACCESS_TOKEN,
          {},
          { withCredentials: true }
        );

        if (data.access_token) {
          // Store the new access token
          localStorage.setItem("access_token", data.access_token);
          
          // Update the original request with new token
          originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;
          
          // Process any queued requests with the new token
          processQueue(null, data.access_token);
          
          // Retry the original request
          return axiosInstance(originalRequest);
        } else {
          throw new Error('No access token in response');
        }

      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        
        // Process queue with error
        processQueue(refreshError, null);
        
        // Clear stored token and redirect
        localStorage.removeItem("access_token");
        
        // Only redirect if not already on login/register pages
        if (!window.location.pathname.startsWith('/login') && 
            !window.location.pathname.startsWith('/register')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other error cases
    if (error.response) {
      if (error.response.status === 500) {
        console.error("Server error. Please try again later");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timed out. Please try again.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;