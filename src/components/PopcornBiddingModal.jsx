import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';
import { adminService } from '../services/interceptors/admin.service';
import './PopcornBiddingModal.css';

function parseApiError(err) {
  const d = err?.response?.data;
  if (typeof d === 'string') return d;
  if (d?.detail) return String(d.detail);
  if (d?.message) return String(d.message);
  if (Array.isArray(d) && d[0]) return String(d[0]);
  return err?.message || 'Something went wrong';
}

export default function PopcornBiddingModal({ isOpen, onClose, eventId, eventTitle }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [popcornEnabled, setPopcornEnabled] = useState(false);
  const [thresholdMins, setThresholdMins] = useState('');
  const [extensionMins, setExtensionMins] = useState('');
  const thresholdPreview = Number.parseInt(String(thresholdMins).trim(), 10);
  const extensionPreview = Number.parseInt(String(extensionMins).trim(), 10);
  const safeThreshold = Number.isFinite(thresholdPreview) && thresholdPreview >= 0 ? thresholdPreview : 0;
  const safeExtension = Number.isFinite(extensionPreview) && extensionPreview >= 0 ? extensionPreview : 0;

  const load = useCallback(async () => {
    if (eventId == null) return;
    setLoading(true);
    try {
      const data = await adminService.getEventPopcorn(eventId);
      setPopcornEnabled(!!data?.popcorn_enabled);
      setThresholdMins(
        data?.popcorn_threshold_mins != null ? String(data.popcorn_threshold_mins) : ''
      );
      setExtensionMins(
        data?.popcorn_extension_mins != null ? String(data.popcorn_extension_mins) : ''
      );
    } catch (err) {
      toast.error(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (!isOpen || eventId == null) return;
    load();
  }, [isOpen, eventId, load]);

  const handleBackdropKeyDown = (e) => {
    if (e.key === 'Escape') onClose?.();
  };

  const handleToggle = async () => {
    if (eventId == null || toggling) return;
    setToggling(true);
    try {
      await adminService.toggleEventPopcorn(eventId);
      await load();
      toast.success('Popcorn bidding updated');
    } catch (err) {
      toast.error(parseApiError(err));
    } finally {
      setToggling(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (eventId == null || saving) return;
    const t = Number.parseInt(String(thresholdMins).trim(), 10);
    const x = Number.parseInt(String(extensionMins).trim(), 10);
    if (!Number.isFinite(t) || t < 0) {
      toast.error('Enter a valid threshold (minutes).');
      return;
    }
    if (!Number.isFinite(x) || x < 0) {
      toast.error('Enter a valid extension (minutes).');
      return;
    }
    setSaving(true);
    try {
      await adminService.updateEventPopcorn(eventId, {
        popcorn_threshold_mins: t,
        popcorn_extension_mins: x,
      });
      await load();
      toast.success('Popcorn rules saved');
    } catch (err) {
      toast.error(parseApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="popcorn-modal-root"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      onKeyDown={handleBackdropKeyDown}
    >
      <div
        className="popcorn-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popcorn-modal-title"
      >
        <div className="popcorn-modal-header">
          <h2 id="popcorn-modal-title" className="popcorn-modal-title">
            Popcorn Bidding
          </h2>
          {eventTitle ? (
            <p className="popcorn-modal-subtitle">{eventTitle}</p>
          ) : null}
          <button
            type="button"
            className="popcorn-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="popcorn-modal-body">
          {loading ? (
            <div className="popcorn-modal-loading">Loading…</div>
          ) : (
            <form onSubmit={handleSave} className="popcorn-modal-form">
              <div className="popcorn-modal-field">
                <div className="popcorn-modal-field-head">
                  <span className="popcorn-modal-label">Popcorn bidding</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={popcornEnabled}
                    disabled={toggling}
                    className={`popcorn-modal-switch${popcornEnabled ? ' popcorn-modal-switch--on' : ''}`}
                    onClick={handleToggle}
                  >
                    <span className="popcorn-modal-switch-knob" />
                  </button>
                </div>
                <p className="popcorn-modal-hint">
                  {popcornEnabled ? 'Enabled — late bids extend the clock.' : 'Disabled.'}
                </p>
              </div>

              <label className="popcorn-modal-field">
                <span className="popcorn-modal-label">Threshold (minutes)</span>
                <input
                  type="number"
                  min={0}
                  className="popcorn-modal-input"
                  value={thresholdMins}
                  onChange={(ev) => setThresholdMins(ev.target.value)}
                  inputMode="numeric"
                />
              </label>

              <label className="popcorn-modal-field">
                <span className="popcorn-modal-label">Extension (minutes)</span>
                <input
                  type="number"
                  min={0}
                  className="popcorn-modal-input"
                  value={extensionMins}
                  onChange={(ev) => setExtensionMins(ev.target.value)}
                  inputMode="numeric"
                />
              </label>
              <p className="popcorn-modal-detail-line">
                Bids placed within the last {safeThreshold} minutes extend the event by {safeExtension} minutes.
              </p>

              <div className="popcorn-modal-actions">
                <button type="button" className="popcorn-modal-btn popcorn-modal-btn--ghost" onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="popcorn-modal-btn popcorn-modal-btn--primary"
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Save rules'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
