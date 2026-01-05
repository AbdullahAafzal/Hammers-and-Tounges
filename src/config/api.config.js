export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://207.180.233.44:8001',
  TIMEOUT: 30000,
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
};

export const API_ROUTES = {
  // Authentication
  REGISTER: '/api/users/register/',
  LOGIN: '/api/users/login/',
  VERIFY_OTP: '/api/users/verify-otp/',
  RESEND_OTP: '/api/users/resend-otp/',
  REFRESH_TOKEN: '/api/users/token/refresh/',
  PASSWORD_RESET_REQUEST: '/api/users/password-reset-request/',
  PASSWORD_OTP_VERIFY: '/api/users/password-OTP-verify/',
  PASSWORD_RESET_CONFIRM: '/api/users/password-reset-confirm/',
  
  // Profile
  PROFILE: '/api/users/profile/',
  PROFILE_DELETE: '/api/users/profile/delete/',
  PROFILE_UPDATE: '/api/users/profile/',

  // Admin Routes
  ADMIN_DASHBOARD: '/api/inspections/admin/dashboard/',
  ADMIN_USER_ACTION: '/api/inspections/admin/user-action/',
  ADMIN_ASSIGN_AUCTION: '/api/inspections/admin/assign/',
  ADMIN_USERS_LIST: '/api/inspections/admin/users/',
  AUCTION_LISTINGS: '/api/auctions/listings/',
  
  // Manager Routes
  MANAGER_TASKS: '/api/inspections/manager/tasks/',
  MANAGER_INSPECT: '/api/inspections/manager/inspect/', // + auction_id
  INSPECTION_REPORTS: '/api/inspections/reports/',
  INSPECTION_REPORT_DETAIL: '/api/inspections/reports/', // + report_id
  
  // Checklist/Template Routes
  INSPECTION_TEMPLATES: '/api/inspections/templates/',
  INSPECTION_TEMPLATE_DETAIL: '/api/inspections/templates/', // + template_id
};