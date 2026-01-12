// export const API_CONFIG = {
//   BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://207.180.233.44:8001',

//   TIMEOUT: 30000,
//   IS_PRODUCTION: import.meta.env.PROD,
//   IS_DEVELOPMENT: import.meta.env.DEV,
//   APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
// };

export const API_CONFIG = {
  BASE_URL: import.meta.env.PROD ? '/api' : 'http://207.180.233.44:8001/api',
  TIMEOUT: 30000,

  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
  MEDIA_BASE_URL: import.meta.env.VITE_MEDIA_BASE_URL,
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
};

export const API_ROUTES = {
  // Authentication
  REGISTER: '/users/register/',
  LOGIN: '/users/login/',
  VERIFY_OTP: '/users/verify-otp/',
  RESEND_OTP: '/users/resend-otp/',
  REFRESH_TOKEN: '/users/token/refresh/',
  PASSWORD_RESET_REQUEST: '/users/password-reset-request/',
  PASSWORD_OTP_VERIFY: '/users/password-OTP-verify/',
  PASSWORD_RESET_CONFIRM: '/users/password-reset-confirm/',

  // Profile
  PROFILE: '/users/profile/',
  PROFILE_DELETE: '/users/profile/delete/',
  PROFILE_UPDATE: '/users/profile/',

  // Admin Routes
  ADMIN_DASHBOARD: '/inspections/admin/dashboard/',
  ADMIN_USER_ACTION: '/inspections/admin/user-action/',
  ADMIN_ASSIGN_AUCTION: '/inspections/admin/assign/',
  ADMIN_USERS_LIST: '/inspections/admin/users/',
  ADMIN_UPDATE_USER: '/users/admin/', // + userId + /update/
  ADMIN_CREATE_STAFF: '/users/admin/create-staff/',
  AUCTION_LISTINGS: '/auctions/listings/',
  FETCH_CATEGORIES: '/auctions/categories/',
  CREATE_CATEGORY: '/auctions/categories/',
  UPDATE_CATEGORY: '/auctions/categories/',
  DELETE_CATEGORY: '/auctions/categories/',
  TOGGLE_CATEGORY: '/auctions/categories/', // + categoryId + /toggle/

  // Manager Routes
  MANAGER_TASKS: '/inspections/manager/tasks/',
  MANAGER_INSPECT: '/inspections/manager/inspect/', // + auction_id
  INSPECTION_REPORTS: '/inspections/reports/',
  INSPECTION_REPORT_DETAIL: '/inspections/reports/', // + report_id

  // Checklist/Template Routes
  INSPECTION_TEMPLATES: '/inspections/templates/',
  INSPECTION_TEMPLATE_DETAIL: '/inspections/templates/', // + template_id

  //// Auction Routes (Common for all)
  AUCTIONS_LIST: '/auctions/listings/',
  // AUCTION_DETAIL: '/auctions/listings/', // + auction_id
  AUCTION_CATEGORIES: '/auctions/categories/',
  AUCTION_CATEGORY_DETAIL: '/auctions/categories/', // + category_id

  // Seller Routes
  CREATE_AUCTION: '/auctions/listings/',
  UPDATE_AUCTION: '/auctions/listings/', // + auction_id
  DELETE_AUCTION: '/auctions/listings/', // + auction_id

  AUCTION_APPROVAL_REQUEST: '/auctions/listings/',
  AUCTION_ACTION: '/auctions/listings/', // + auction_id + /action/

  // Buyer Routes
  PLACE_BID: '/auctions/bid/',
  GET_AUCTION_BIDS: '/auctions/listings/', // + auction_id + /bids/

  AUCTION_BID_HISTORY: '/auctions/listings/', // + auction_id + /bid-history/
  BIDS_LIST: '/auctions/bids/my/',
  // BIDS_NO: '/auctions/bids//my/',
  WATCH_LIST: '/auctions/watchlist/',

};