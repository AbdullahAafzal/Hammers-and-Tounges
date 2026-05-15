export const normalizePhantomReport = (data) => {
  if (!data || typeof data !== 'object') {
    return { totalLots: 0, lots: [], isSingleLot: false };
  }

  if (Array.isArray(data.lots)) {
    return {
      totalLots: data.total_lots_with_phantom_activity ?? data.lots.length,
      lots: data.lots,
      isSingleLot: false,
    };
  }

  if (data.lot_id != null) {
    return {
      totalLots: 1,
      lots: [data],
      isSingleLot: true,
    };
  }

  return { totalLots: 0, lots: [], isSingleLot: false };
};

export const sumPhantomBidCount = (lots) =>
  (lots || []).reduce((sum, lot) => sum + (Number(lot?.phantom_bid_count) || 0), 0);

export const maxPhantomBidAmount = (lots) =>
  (lots || []).reduce((max, lot) => Math.max(max, Number(lot?.highest_phantom_bid) || 0), 0);
