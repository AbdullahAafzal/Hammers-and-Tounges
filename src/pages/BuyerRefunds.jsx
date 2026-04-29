import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { profileService } from "../services/interceptors/profile.service";
import "./BuyerProfile.css";
import "./BuyerWallet.css";
import "./BuyerRefunds.css";

function formatWalletCurrency(n) {
  const v = Number(n);
  if (Number.isNaN(v)) return "$0.00";
  return `$${v.toFixed(2)}`;
}

function formatPaymentWhen(isoOrStr) {
  if (isoOrStr == null || isoOrStr === "") return "—";
  const d = new Date(isoOrStr);
  if (Number.isNaN(d.getTime())) return String(isoOrStr);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function refundStatusClass(status) {
  const s = String(status || "").toLowerCase();
  if (/(approved|success|completed)/i.test(s)) return "wallet-history-status--success";
  if (/(pending|processing|submitted|initiated)/i.test(s)) return "wallet-history-status--pending";
  if (/(rejected|failed|error|cancelled|canceled)/i.test(s)) return "wallet-history-status--failed";
  return "wallet-history-status--neutral";
}

function refundChannelLabel(channel) {
  const c = String(channel || "").toUpperCase();
  if (c === "BANK_TRANSFER") return "Bank Transfer";
  if (c === "VISA") return "Visa / Card Reversal";
  if (c === "MOBILE_MONEY") return "Mobile Money";
  return c || "—";
}

function refundRejectionReason(refund) {
  if (refund?.rejection_reason) return String(refund.rejection_reason);
  const logs = Array.isArray(refund?.audit_logs) ? refund.audit_logs : [];
  const rejectedLog = logs.find((l) => /rejected|failed/i.test(String(l?.to_status || '')));
  return rejectedLog?.notes ? String(rejectedLog.notes) : '';
}

const BuyerRefunds = () => {
  const [wallet, setWallet] = useState(null);
  const [refundsLoading, setRefundsLoading] = useState(false);
  const [refunds, setRefunds] = useState([]);
  const [refundDetailLoading, setRefundDetailLoading] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundChannel, setRefundChannel] = useState("");
  const [refundSubmitting, setRefundSubmitting] = useState(false);

  const loadRefunds = useCallback(async () => {
    setRefundsLoading(true);
    try {
      const [walletResp, list] = await Promise.all([profileService.getWallet(), profileService.getRefunds()]);
      setWallet(walletResp);
      setRefunds(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to load refunds."
      );
      setRefunds([]);
    } finally {
      setRefundsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRefunds();
  }, [loadRefunds]);

  const handleViewRefund = useCallback(async (id) => {
    if (id == null) return;
    setRefundDetailLoading(true);
    try {
      const detail = await profileService.getRefundById(id);
      setSelectedRefund(detail);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to load refund details."
      );
    } finally {
      setRefundDetailLoading(false);
    }
  }, []);

  const handleSubmitRefund = useCallback(async () => {
    const available = Number(wallet?.available_balance ?? 0);
    const amount = Number(refundAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Refund amount must be greater than 0.");
      return;
    }
    if (amount > available) {
      toast.error("Refund amount cannot exceed available wallet balance.");
      return;
    }
    if (!refundChannel) {
      toast.error("Payment channel is required.");
      return;
    }
    setRefundSubmitting(true);
    try {
      await profileService.createRefund({
        amount: amount.toFixed(2),
        payment_channel: refundChannel,
      });
      toast.success("Refund request created successfully.");
      setRefundAmount("");
      setRefundChannel("");
      await loadRefunds();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to create refund request."
      );
    } finally {
      setRefundSubmitting(false);
    }
  }, [wallet?.available_balance, refundAmount, refundChannel, loadRefunds]);

  const available = useMemo(() => Number(wallet?.available_balance ?? 0), [wallet?.available_balance]);
  const pendingCount = useMemo(
    () =>
      refunds.filter((r) =>
        /(pending|processing|submitted|initiated)/i.test(String(r?.status || ""))
      ).length,
    [refunds]
  );

  return (
    <div className="wallet-page">
      <div className="wallet-content">
        <div className="wallet-container buyer-refunds-screen">
          <nav className="breadcrumbs">
            <Link to="/buyer/dashboard">Live Auction</Link>
            <span>/</span>
            <Link to="/buyer/wallet">Wallet</Link>
            <span>/</span>
            <span>Refunds</span>
          </nav>

          <div className="page-header">
            <div className="buyer-refunds-header">
              <h1 className="page-title">Refunds</h1>
              <Link to="/buyer/wallet" className="b-action-btn b-outline small">
                Back to Wallet
              </Link>
            </div>
          </div>

          <div className="buyer-refunds-card">
            <div className="buyer-refunds-overview">
              <div className="buyer-refunds-stat">
                <span>Available wallet amount</span>
                <strong>{formatWalletCurrency(available)}</strong>
              </div>
              <div className="buyer-refunds-stat">
                <span>Total requests</span>
                <strong>{refunds.length}</strong>
              </div>
              <div className="buyer-refunds-stat">
                <span>Pending requests</span>
                <strong>{pendingCount}</strong>
              </div>
            </div>

            <div className="buyer-refund-form">
              <input
                type="number"
                min="0"
                step="0.01"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="Refund amount"
                className="edit-input"
              />
              <select
                className="edit-input"
                value={refundChannel}
                onChange={(e) => setRefundChannel(e.target.value)}
              >
                <option value="">Select payment channel</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="VISA">Visa / Card Reversal</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
              </select>
              <button
                type="button"
                className="buyer-payment-modal__primary buyer-payment-modal__primary--success"
                onClick={handleSubmitRefund}
                disabled={refundSubmitting}
              >
                {refundSubmitting ? "Submitting..." : "Request Refund"}
              </button>
            </div>

            <div className="buyer-refund-list">
              <div className="buyer-refund-list-head">
                <h3>Your refund requests</h3>
              </div>
              {refundsLoading ? (
                <p className="buyer-wallet-history__state">Loading refunds...</p>
              ) : refunds.length === 0 ? (
                <p className="buyer-wallet-history__state buyer-wallet-history__state--empty">
                  No refund requests yet.
                </p>
              ) : (
                <ul className="buyer-wallet-history__list buyer-refunds-list">
                  {refunds.map((r) => (
                    <li key={String(r.id)} className="buyer-wallet-history__row">
                      <div className="buyer-wallet-history__row-main">
                        <div className="buyer-wallet-history__row-title">{refundChannelLabel(r.payment_channel)}</div>
                        <span className={`wallet-history-status ${refundStatusClass(r.status)}`}>
                          {String(r.status || "—")}
                        </span>
                      </div>
                      <div className="buyer-wallet-history__row-meta">
                        <span className="buyer-wallet-history__amount">
                          {formatWalletCurrency(Number(r.amount ?? 0))}
                        </span>
                        <span className="buyer-wallet-history__when">{formatPaymentWhen(r.created_at)}</span>
                      </div>
                      {/rejected|failed/i.test(String(r?.status || '')) && refundRejectionReason(r) ? (
                        <div className="buyer-wallet-history__row-meta">
                          <span className="buyer-refunds-reason-inline">Reason: {refundRejectionReason(r)}</span>
                        </div>
                      ) : null}
                      <div className="buyer-refunds-row-actions">
                        <button
                          type="button"
                          className="b-action-btn b-outline small buyer-refunds-view-btn"
                          onClick={() => handleViewRefund(r.id)}
                        >
                          View Details
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {selectedRefund ? (
              <div className="buyer-refund-detail">
                {refundDetailLoading ? (
                  <p className="buyer-wallet-history__state">Loading refund detail...</p>
                ) : (
                  <>
                    <div className="buyer-refund-detail__head">
                      <h4>Refund #{selectedRefund.id}</h4>
                      <span className={`wallet-history-status ${refundStatusClass(selectedRefund.status)}`}>
                        {String(selectedRefund.status || "—")}
                      </span>
                    </div>
                    <div className="buyer-refund-detail__grid">
                      <p><span>Amount</span><strong>{formatWalletCurrency(Number(selectedRefund.amount ?? 0))}</strong></p>
                      <p><span>Channel</span><strong>{refundChannelLabel(selectedRefund.payment_channel)}</strong></p>
                      <p><span>Date</span><strong>{formatPaymentWhen(selectedRefund.created_at)}</strong></p>
                    </div>
                    {/rejected|failed/i.test(String(selectedRefund?.status || '')) && refundRejectionReason(selectedRefund) ? (
                      <div className="buyer-refund-detail__reason">
                        <span>Rejection reason</span>
                        <strong>{refundRejectionReason(selectedRefund)}</strong>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerRefunds;
