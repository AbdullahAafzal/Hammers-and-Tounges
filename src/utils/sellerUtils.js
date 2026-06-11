export const formatSellerLabel = (seller) => {
  if (!seller) return 'Seller';
  return (
    seller.full_name ||
    [seller.first_name, seller.last_name].filter(Boolean).join(' ') ||
    seller.display_name ||
    seller.email ||
    `Seller #${seller.id}`
  );
};

export const resolveSellerId = (seller) => {
  if (!seller) return null;
  const id = seller.seller_details?.id ?? seller.seller_id ?? seller.id;
  return id != null ? Number(id) : null;
};

export const normalizeSellerSearchResults = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

/** Extract intake session id from varied API response shapes. */
export const resolveIntakeSessionId = (data, sellerId = null) => {
  if (data == null) return null;

  if (typeof data === 'number' || typeof data === 'string') {
    const n = Number(data);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  if (typeof data !== 'object') return null;

  const direct =
    data.id ??
    data.pk ??
    data.session_id ??
    data.intake_session_id ??
    data.session?.id ??
    data.session?.pk;

  if (direct != null && direct !== '') return direct;

  if (data.intake_session != null) {
    if (typeof data.intake_session === 'object') {
      const nested = data.intake_session.id ?? data.intake_session.pk;
      if (nested != null && nested !== '') return nested;
    } else {
      const n = Number(data.intake_session);
      if (Number.isFinite(n) && n > 0) return n;
    }
  }

  const results = Array.isArray(data.results)
    ? data.results
    : Array.isArray(data)
      ? data
      : [];

  if (results.length > 0) {
    if (sellerId != null) {
      const sellerNum = Number(sellerId);
      const match = results.find((row) => {
        const rowSeller = row.seller ?? row.seller_id ?? row.seller_details?.id;
        return rowSeller != null && Number(rowSeller) === sellerNum;
      });
      const matchId = match?.id ?? match?.pk;
      if (matchId != null && matchId !== '') return matchId;
    }
    const firstId = results[0]?.id ?? results[0]?.pk;
    if (firstId != null && firstId !== '') return firstId;
  }

  return null;
};
