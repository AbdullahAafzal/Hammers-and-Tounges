export const maskBidderName = (value) => {
  const name = String(value ?? '').trim();
  if (!name) return 'Bidder';

  if (name.length <= 2) return `${name[0]}*`;
  if (name.length === 3) return `${name[0]}*${name[2]}`;

  return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}`;
};

const SYSTEM_BIDDER_LABELS = [
  'System Generate',
  'System Generated',
  'System Phantom Bot',
];

const SYSTEM_BIDDER_NAMES = new Set(
  SYSTEM_BIDDER_LABELS.map((label) => label.toLowerCase()),
);

const isMaskedName = (name) => {
  const value = String(name ?? '').trim();
  if (value.length < 3) return false;
  const middle = value.slice(1, -1);
  return middle.length > 0 && middle.split('').every((char) => char === '*');
};

const maskedNameMatches = (fullName, masked) => {
  const full = String(fullName ?? '').trim();
  const value = String(masked ?? '').trim();
  if (!full || !value || full.length !== value.length) return false;
  if (full[0] !== value[0] || full[full.length - 1] !== value[value.length - 1]) return false;
  return isMaskedName(value);
};

const normalizeBidderName = (value) => String(value ?? '').trim().toLowerCase();

export const isSystemGeneratedBidder = (value) => {
  const name = String(value ?? '').trim();
  if (!name) return false;

  const normalized = normalizeBidderName(name);
  if (SYSTEM_BIDDER_NAMES.has(normalized)) return true;

  if (
    normalized.includes('system phantom bot') ||
    normalized.includes('system generated') ||
    normalized.includes('system generate')
  ) {
    return true;
  }

  if (isMaskedName(name)) {
    return SYSTEM_BIDDER_LABELS.some((label) => maskedNameMatches(label, name));
  }

  return false;
};

export const resolveSystemBidderDisplayName = (value) => {
  const name = String(value ?? '').trim();
  if (!name) return name;

  const normalized = normalizeBidderName(name);
  const exact = SYSTEM_BIDDER_LABELS.find((label) => normalizeBidderName(label) === normalized);
  if (exact) return exact;

  if (normalized.includes('system phantom bot')) return 'System Phantom Bot';
  if (normalized.includes('system generated')) return 'System Generated';
  if (normalized.includes('system generate')) return 'System Generate';

  const fromMask = SYSTEM_BIDDER_LABELS.find((label) => maskedNameMatches(label, name));
  return fromMask || name;
};

const isSystemBidFromFlags = (bid) => {
  if (!bid || typeof bid !== 'object') return false;
  return [
    bid.is_phantom,
    bid.is_system,
    bid.phantom_bid,
    bid.system_bid,
    bid.is_phantom_bid,
    bid.is_system_bid,
    bid.is_system_generated,
  ].some((flag) => flag === true || flag === 1 || flag === 'true');
};

export const getBidderNameFromBid = (bid) =>
  bid?.bidder_name ??
  bid?.user_name ??
  bid?.bidder ??
  bid?.bidder_email ??
  '';

/** Admin bid history: show full name for system bids; mask real users. */
export const maskBidderNameForAdmin = (valueOrBid) => {
  if (valueOrBid && typeof valueOrBid === 'object') {
    const bid = valueOrBid;
    const name = getBidderNameFromBid(bid);
    if (!name) return 'Bidder';
    if (isSystemBidFromFlags(bid) || isSystemGeneratedBidder(name)) {
      return resolveSystemBidderDisplayName(name);
    }
    return maskBidderName(name);
  }

  const name = String(valueOrBid ?? '').trim();
  if (!name) return 'Bidder';
  if (isSystemGeneratedBidder(name)) return resolveSystemBidderDisplayName(name);
  return maskBidderName(name);
};
