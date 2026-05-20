/** Role-based dashboard paths after login (aligned with SignIn.jsx). */
export const getDashboardPathForUser = (user) => {
  if (!user) {
    return '/';
  }

  const role = (user.role || '').toLowerCase();
  const isStaff =
    user.is_staff === true ||
    user.is_staff === 1 ||
    String(user.is_staff).toLowerCase() === 'true';

  if (role === 'buyer') return '/buyer/dashboard';
  if (role === 'seller') return '/seller/dashboard';
  if (role === 'finance') return '/admin/dashboard';
  if (isStaff) return '/admin/dashboard';
  if (role === 'manager') return '/manager/dashboard';
  if (role === 'clerk') return '/clerk/dashboard';
  return '/';
};
