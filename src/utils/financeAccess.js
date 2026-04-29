export const isFinanceUser = (user) =>
  String(user?.role || "").toLowerCase() === "finance";

export const isFinanceAdminFlow = (pathname, user) =>
  String(pathname || "").startsWith("/admin") && isFinanceUser(user);

export const FINANCE_READ_ONLY_FEATURES = {
  manage_users: { read: true, create: false, update: false, delete: false },
  manage_events: { read: true, create: false, update: false, delete: false },
  manage_categories: { read: true, create: false, update: false, delete: false },
  manage_grv: { read: true, create: false, update: false, delete: false },
  deposit_exempt: { read: true, create: false, update: false, delete: false },
};
