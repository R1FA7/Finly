export const BASE_API = "/api/v1"

export const API_PATHS = {
  AUTH: {
    REGISTER: `${BASE_API}/auth/register`,
    LOGIN: `${BASE_API}/auth/login`,
    GET_USER_INFO: `${BASE_API}/auth/getUserInfo`,
    REFRESH_ACCESS_TOKEN : `${BASE_API}/auth/refresh-token`,
    LOGOUT: `${BASE_API}/auth/logout`,
    UPDATE : `${BASE_API}/auth/update-profile`,
    SEND_OTP: `${BASE_API}/auth/send-reset-otp`,
    VERIFY_OTP: `${BASE_API}/auth/verify-reset-otp`,
    RESET_PASSWORD: `${BASE_API}/auth/reset-password`,
    VERIFY_ACCOUNT: `${BASE_API}/auth/verify-account`,
    ACCOUNT_VERIFICATION_OTP:`${BASE_API}/auth/send-verify-otp`,
    EXTRACT_MSG:`${BASE_API}/auth`,
    DISMISS_MSG:`${BASE_API}/auth`,
  },
  DASHBOARD:{
    GET_DATA: `${BASE_API}/dashboard`,
  },
  GOAL:{
    CU_GOAL : `${BASE_API}/goal`
  },
  TRANSACTION:{
    GET_ALL: (type)=>`${BASE_API}/transaction?type=${type}`,

    ADD: `${BASE_API}/transaction`,

    UPDATE: (id)=> `${BASE_API}/transaction/${id}`,

    DELETE: (id) =>`${BASE_API}/transaction/${id}`,

    DOWNLOAD_EXCEL: (type) =>`${BASE_API}/transaction/downloadexcel?type=${type}`
  },
  ADMIN: {
    GET_ALL:`${BASE_API}/admin`,
    DELETE: (id) => `${BASE_API}/admin/${id}`,
    UPDATE: (id) => `${BASE_API}/admin/${id}`,
    
    SEND_MESSAGE: `${BASE_API}/admin/messages`,
    GET_ADMIN_MSG: `${BASE_API}/admin/messages`,
    DELETE_MSG: (id) => `${BASE_API}/admin/messages/${id}`,
    DEACTIVATE_MSG: (id) => `${BASE_API}/admin/messages/${id}`,
  },
  CHAT:{
    CHATBOT:`${BASE_API}/chatbot`
  }
}