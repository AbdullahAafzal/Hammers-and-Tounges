import { getMediaUrl } from '../config/api.config';

export const formatPrice = (price, currency = 'USD') => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
};

export const getAuctionImage = (auction) => {
  if (auction.media && auction.media.length > 0) {
    const imageMedia = auction.media.find(m => m.media_type === 'image');
    if (imageMedia) {
      return getMediaUrl(imageMedia.file);
    }
  }
  return 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80';
};

export const getAuctionStatus = (auction, now) => {
  const startDate = new Date(auction.start_date);
  const endDate = new Date(auction.end_date);

  if (now < startDate) {
    return 'upcoming';
  } else if (now > endDate) {
    return 'ended';
  } else {
    return 'active';
  }
};

export const extractUniqueCategories = (auctions) => {
  const categories = new Set();
  auctions.forEach(auction => {
    if (auction.category_name) {
      categories.add(auction.category_name);
    }
  });
  return Array.from(categories).sort();
};

export const extractUniqueStatuses = (auctions) => {
  const statuses = new Set();
  auctions.forEach(auction => {
    if (auction.status) {
      statuses.add(auction.status);
    }
  });
  return Array.from(statuses).sort();
};