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

/** Senior admin or staff — not finance officers. Caller should also limit to `/admin/` routes on web. */
export function canAuthoriseRefunds(user) {
  if (!user) return false;
  if (String(user.role || "").toLowerCase() === "finance") return false;
  const role = String(user.role || "").toLowerCase();
  if (role === "admin") return true;
  return (
    user.is_staff === true ||
    user.is_staff === 1 ||
    String(user.is_staff || "").toLowerCase() === "true"
  );
}
