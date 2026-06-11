function readExemptAmountFromPayload(payload) {
  if (!payload || typeof payload !== "object") return null;

  if (payload.deposit_exempt && typeof payload.deposit_exempt === "object") {
    const nested = readExemptAmountFromPayload(payload.deposit_exempt);
    if (nested != null) return nested;
  }

  const v =
    payload.deposit_exempt_amount ??
    payload.deposit_exemption_amount ??
    payload.exempt_amount ??
    payload.bidding_limit ??
    payload.deposit_exempt_limit ??
    payload.limit ??
    payload.amount;
  if (v == null || v === "") return null;
  const n = Number(v);
  if (Number.isNaN(n) || n <= 0) return null;
  return n;
}

export function getDepositExemptAmount(user) {
  return readExemptAmountFromPayload(user);
}

export function formatDepositExemptAmount(amount) {
  if (amount == null) return "Not exempt";
  return `$${Number(amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export function mergeDepositExemptFromResponse(user, response, submittedAmount) {
  const amount =
    readExemptAmountFromPayload(response) ??
    (Number(submittedAmount) > 0 ? Number(submittedAmount) : null);
  return {
    ...user,
    ...(response && typeof response === "object" ? response : {}),
    deposit_exempt_amount: amount,
    is_deposit_exempt: amount != null,
  };
}

export async function enrichUsersWithDepositExempt(users, getDepositExempt) {
  if (users?.[0]) {
    console.log("[DepositExemption] list user sample keys:", Object.keys(users[0]));
    console.log("[DepositExemption] list user sample:", users[0]);
  }

  const enriched = await Promise.all(
    (users || []).map(async (user) => {
      const userId = user?.id ?? user?.user_id ?? user?.userId;
      if (userId == null) return user;

      const fromList = getDepositExemptAmount(user);
      if (fromList != null) {
        console.log("[DepositExemption] amount from list", userId, fromList);
        return mergeDepositExemptFromResponse(user, user, fromList);
      }

      try {
        const data = await getDepositExempt(userId);
        console.log("[DepositExemption] GET deposit-exempt parsed", userId, {
          raw: data,
          parsedAmount: readExemptAmountFromPayload(data),
        });
        return mergeDepositExemptFromResponse(user, data, null);
      } catch (err) {
        console.warn("[DepositExemption] GET deposit-exempt failed", userId, {
          status: err?.response?.status,
          data: err?.response?.data,
        });
        const status = err?.response?.status;
        if (status === 404 || status === 204) return user;
        return user;
      }
    })
  );

  const withAmount = enriched.filter((u) => getDepositExemptAmount(u) != null);
  console.log(
    "[DepositExemption] loaded",
    enriched.length,
    "buyers,",
    withAmount.length,
    "with exemption amounts:",
    withAmount.map((u) => ({
      id: u?.id ?? u?.user_id ?? u?.userId,
      email: u?.email,
      amount: getDepositExemptAmount(u),
    }))
  );

  return enriched;
}

export function buildDraftMapFromUsers(users) {
  const nextDraft = {};
  (users || []).forEach((user) => {
    const userId = user?.id ?? user?.user_id ?? user?.userId;
    const amount = getDepositExemptAmount(user);
    nextDraft[userId] = amount != null ? String(amount) : "";
  });
  return nextDraft;
}
