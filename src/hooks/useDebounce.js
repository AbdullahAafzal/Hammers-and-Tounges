import { useState } from 'react';

export const useBuyerLotAutoBid = (lotId) => {
  const [autoBidAmount, setAutoBidAmount] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);

  return { autoBidAmount, setAutoBidAmount, isEnabled, setIsEnabled };
};