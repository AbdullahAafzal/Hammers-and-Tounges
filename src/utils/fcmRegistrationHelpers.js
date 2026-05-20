export const FCM_REGISTERED_ACCOUNTS_KEY = 'fcmRegisteredAccounts';

export const getAuthUserId = (user) => {
  if (!user) return null;
  const id = user.id ?? user.pk;
  return id != null ? id : null;
};

/** All roles this account should receive push for (e.g. manager + is_staff → manager + admin). */
export const getNotificationRolesForUser = (user) => {
  if (!user) return [];

  const roles = new Set();
  const role = String(user.role || '').toLowerCase();

  if (role) {
    roles.add(role);
  }

  const isStaff =
    user.is_staff === true ||
    user.is_staff === 1 ||
    String(user.is_staff).toLowerCase() === 'true';

  if (isStaff && role !== 'finance') {
    roles.add('admin');
  }

  return Array.from(roles);
};

export const buildFcmRegisterPayload = (token, deviceType, user, deviceRegistry = []) => {
  const roles = getNotificationRolesForUser(user);
  const userId = getAuthUserId(user);
  const registeredUserIds = deviceRegistry.map((entry) => entry.userId).filter((id) => id != null);

  return {
    registration_id: token,
    device_type: deviceType,
    role: roles[0] || null,
    roles,
    user_id: userId,
    allow_shared_device: true,
    registered_user_ids: registeredUserIds,
  };
};

export const mergeAccountIntoDeviceRegistry = (registry, user, token) => {
  const userId = getAuthUserId(user);
  if (userId == null) {
    return Array.isArray(registry) ? registry : [];
  }

  const roles = getNotificationRolesForUser(user);
  const list = Array.isArray(registry) ? registry.filter((entry) => entry.userId !== userId) : [];

  list.push({
    userId,
    roles,
    token,
    lastRegisteredAt: Date.now(),
  });

  return list;
};
