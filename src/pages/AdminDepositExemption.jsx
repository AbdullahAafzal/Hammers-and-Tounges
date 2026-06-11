import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { adminService } from "../services/interceptors/admin.service";
import { toast } from "react-toastify";
import { isFinanceAdminFlow } from "../utils/financeAccess";
import {
  formatDepositExemptAmount,
  getDepositExemptAmount,
  mergeDepositExemptFromResponse,
  enrichUsersWithDepositExempt,
  buildDraftMapFromUsers,
} from "../utils/depositExemption";
import "./AdminDepositExemption.css";

const getUserDisplayName = (user) => {
  const full =
    user?.full_name ||
    user?.display_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim();
  return full || user?.email || `User #${user?.id ?? "N/A"}`;
};

const AdminDepositExemption = () => {
  const location = useLocation();
  const features = useSelector((state) => state.permissions?.features);
  const authUser = useSelector((state) => state.auth?.user);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingMap, setIsSavingMap] = useState({});
  const [buyers, setBuyers] = useState([]);
  const [search, setSearch] = useState("");
  const [draftMap, setDraftMap] = useState({});
  const isManagerFlow = location.pathname.startsWith("/manager");
  const isFinanceReadOnly = isFinanceAdminFlow(location.pathname, authUser);
  const hasManagerDepositExemptAccess = !isManagerFlow || features?.deposit_exempt?.read === true;
  const canEditDepositExempt =
    !isFinanceReadOnly && (!isManagerFlow || features?.deposit_exempt?.create === true);

  const loadBuyers = useCallback(async () => {
    if (!hasManagerDepositExemptAccess) {
      setBuyers([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const pageSize = 100;
      let page = 1;
      let hasNext = true;
      const allBuyers = [];

      while (hasNext) {
        const data = await adminService.getUsersList({
          role: "buyer",
          page,
          page_size: pageSize,
        });
        const chunk = Array.isArray(data?.results) ? data.results : [];
        allBuyers.push(...chunk);
        hasNext = !!data?.has_next;
        page += 1;
      }

      const seen = new Set();
      const uniqueBuyers = allBuyers.filter((u) => {
        const id = String(u?.id ?? u?.user_id ?? u?.userId ?? "");
        if (!id || seen.has(id)) return false;
        seen.add(id);
        return true;
      });

      const enrichedBuyers = await enrichUsersWithDepositExempt(
        uniqueBuyers,
        (userId) => adminService.getUserDepositExempt(userId)
      );
      setBuyers(enrichedBuyers);
      setDraftMap(buildDraftMapFromUsers(enrichedBuyers));
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to load buyers";
      toast.error(message);
      setBuyers([]);
    } finally {
      setIsLoading(false);
    }
  }, [hasManagerDepositExemptAccess]);

  useEffect(() => {
    loadBuyers();
  }, [loadBuyers]);

  const filteredBuyers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return buyers;
    return buyers.filter((user) => {
      const name = getUserDisplayName(user).toLowerCase();
      const email = String(user?.email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [buyers, search]);

  const handleDraftChange = (userId, value) => {
    setDraftMap((prev) => ({ ...prev, [userId]: value }));
  };

  const handleSave = async (user, amountValue) => {
    if (!canEditDepositExempt) return;
    const userId = user?.id ?? user?.user_id ?? user?.userId;
    if (userId == null) return;

    const trimmed = String(amountValue ?? "").trim();
    const parsed = trimmed === "" ? 0 : Number(trimmed);
    if (trimmed !== "" && (Number.isNaN(parsed) || parsed < 0)) {
      toast.error("Enter a valid bidding limit amount.");
      return;
    }

    const previous = getDepositExemptAmount(user);
    setIsSavingMap((prev) => ({ ...prev, [userId]: true }));

    try {
      const response = await adminService.setUserDepositExempt(userId, parsed);
      const updated = mergeDepositExemptFromResponse(user, response, parsed);
      setBuyers((prev) =>
        prev.map((u) =>
          String(u?.id ?? u?.user_id ?? u?.userId) === String(userId) ? updated : u
        )
      );
      const savedAmount = getDepositExemptAmount(updated);
      setDraftMap((prev) => ({
        ...prev,
        [userId]: savedAmount != null ? String(savedAmount) : "",
      }));
      toast.success(
        savedAmount != null
          ? `Bidding limit set to ${formatDepositExemptAmount(savedAmount)} for ${getUserDisplayName(user)}.`
          : `Deposit exemption cleared for ${getUserDisplayName(user)}.`
      );
    } catch (err) {
      setDraftMap((prev) => ({
        ...prev,
        [userId]: previous != null ? String(previous) : "",
      }));
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update deposit exemption";
      toast.error(typeof message === "string" ? message : "Failed to update deposit exemption");
    } finally {
      setIsSavingMap((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="dep-page">
      <header className="dep-header">
        <div>
          <h1 className="dep-title">Deposit Exemption</h1>
          <p className="dep-subtitle">
            Set a bidding limit for exempt buyers. Enter an amount (e.g. 50000) to grant exemption.
          </p>
        </div>
      </header>

      {!hasManagerDepositExemptAccess ? (
        <div className="dep-loading">
          <p>You do not have access to Deposit Exemption.</p>
        </div>
      ) : (
        <>
          <div className="dep-filters">
            <input
              type="text"
              className="dep-search"
              placeholder="Search buyers by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {isLoading ? (
            <div className="dep-loading">
              <div className="dep-loading-spinner" />
              <p>Loading buyers...</p>
            </div>
          ) : (
            <div className="dep-table-wrap">
              <table className="dep-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Current limit</th>
                    <th>Bidding limit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBuyers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="dep-empty">
                        No buyer users found.
                      </td>
                    </tr>
                  ) : (
                    filteredBuyers.map((user) => {
                      const userId = user?.id ?? user?.user_id ?? user?.userId;
                      const isSaving = !!isSavingMap[userId];
                      const currentAmount = getDepositExemptAmount(user);
                      const draft = draftMap[userId] ?? (currentAmount != null ? String(currentAmount) : "");
                      return (
                        <tr key={String(userId)}>
                          <td>{getUserDisplayName(user)}</td>
                          <td>{user?.email || "—"}</td>
                          <td>
                            <span
                              className={
                                currentAmount != null ? "dep-current-limit dep-current-limit--active" : "dep-current-limit"
                              }
                            >
                              {formatDepositExemptAmount(currentAmount)}
                            </span>
                          </td>
                          <td>
                            <div className="dep-limit-controls">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="dep-limit-input"
                                placeholder="e.g. 50000"
                                value={draft}
                                disabled={isSaving || !canEditDepositExempt}
                                onChange={(e) => handleDraftChange(userId, e.target.value)}
                                aria-label={`Bidding limit for ${getUserDisplayName(user)}`}
                              />
                              <button
                                type="button"
                                className="dep-save-btn"
                                disabled={isSaving || !canEditDepositExempt}
                                onClick={() => handleSave(user, draft)}
                              >
                                {isSaving ? "Saving…" : "Save"}
                              </button>
                              {currentAmount != null ? (
                                <button
                                  type="button"
                                  className="dep-clear-btn"
                                  disabled={isSaving || !canEditDepositExempt}
                                  onClick={() => handleSave(user, 0)}
                                >
                                  Clear
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDepositExemption;
