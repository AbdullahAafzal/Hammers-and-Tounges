import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getLotImageUrls } from '../utils/lotMedia';
import { auctionService } from '../services/interceptors/auction.service';
import { grvService } from '../services/interceptors/grv.service';
import { inspectionService } from '../services/interceptors/inspection.service';
import { checklistTemplateService } from '../services/interceptors/checklistTemplate.service';
import {
  templateDataToSections,
  buildChecklistData,
  flattenChecklistData,
  isChecklistFilled,
} from '../utils/checklistUtils';
import { toast } from 'react-toastify';
import './GuestLotDrawer.css';
import './GrvLotDrawer.css';

const formatPrice = (price) => {
  if (!price) return '—';
  return parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatSpecificKey = (key) =>
  String(key).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const normalizeGrvList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const pickGrvForLot = (list, lotId) => {
  const id = Number(lotId);
  return list.find((r) => Number(r?.lot) === id) || list[0] || null;
};

const PASS_FAIL_OPTIONS = ['Pass', 'Fail', 'N/A'];

/**
 * Lot detail panel with unified checklist + GRV verification and manager approval.
 */
const GrvLotDrawer = ({ lot: initialLot, onClose, onGrvChanged }) => {
  const location = useLocation();
  const features = useSelector((state) => state.permissions?.features);
  const authUser = useSelector((state) => state.auth?.user);

  const isAdminGrvRoute = location.pathname.startsWith('/admin/');
  const isFinanceReadOnly = isAdminGrvRoute && String(authUser?.role || '').toLowerCase() === 'finance';
  const mg = features?.manage_grv || {};
  const canGrvCreate = !isFinanceReadOnly && (isAdminGrvRoute || mg.create === true);
  const canGrvUpdate = !isFinanceReadOnly && (isAdminGrvRoute || mg.update === true);
  const canGrvDelete = !isFinanceReadOnly && (isAdminGrvRoute || mg.delete === true);
  const canApprove = canGrvUpdate || isAdminGrvRoute;

  const [lot, setLot] = useState(initialLot);
  const [loadingLot, setLoadingLot] = useState(true);
  const [reportLoading, setReportLoading] = useState(true);
  const [grvLoading, setGrvLoading] = useState(true);
  const [templateLoading, setTemplateLoading] = useState(true);
  const [savingGrv, setSavingGrv] = useState(false);
  const [approving, setApproving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const [inspectionReport, setInspectionReport] = useState(null);
  const [grvId, setGrvId] = useState(null);
  const [grvRecord, setGrvRecord] = useState(null);
  const [checklistSections, setChecklistSections] = useState([]);
  const [checklistValues, setChecklistValues] = useState({});
  const [conditionConfirmed, setConditionConfirmed] = useState(false);
  const [notes, setNotes] = useState('');

  const [overallRating, setOverallRating] = useState('');
  const [adminFeedback, setAdminFeedback] = useState('');
  const [initialPrice, setInitialPrice] = useState('');
  const [inspectionFiles, setInspectionFiles] = useState([]);

  const effectiveLot = lot || initialLot;
  const eventTitle = effectiveLot?.event_title || '—';
  const categoryId = effectiveLot?.category ?? effectiveLot?.category_id;
  const imageUrls = getLotImageUrls(effectiveLot);
  const displayImage = imageUrls[selectedImage] || imageUrls[0];

  const specificData = useMemo(() => {
    let sd = effectiveLot?.specific_data;
    if (typeof sd === 'string') {
      try {
        sd = JSON.parse(sd) || {};
      } catch {
        sd = {};
      }
    }
    return sd || {};
  }, [effectiveLot?.specific_data]);

  const currency = effectiveLot?.currency || 'USD';
  const currentBid = effectiveLot?.current_price ?? effectiveLot?.highest_bid ?? effectiveLot?.initial_price;

  const reportChecklistDone = !!inspectionReport?.checklist_completed;
  const reportConditionDone = !!inspectionReport?.condition_confirmed;
  const reportApproved = String(inspectionReport?.status || grvRecord?.status || '').toUpperCase() === 'APPROVED';
  const localChecklistFilled = isChecklistFilled(checklistSections, checklistValues);

  const loadInspectionReport = useCallback(async (lotId) => {
    if (lotId == null) return;
    setReportLoading(true);
    try {
      const report = await inspectionService.getReportByLot(lotId);
      setInspectionReport(report);
      if (report?.checklist_data) {
        setChecklistValues(flattenChecklistData(report.checklist_data));
      }
      if (report?.admin_feedback) setAdminFeedback(report.admin_feedback);
      if (report?.overall_rating) setOverallRating(String(report.overall_rating));
    } catch (err) {
      if (err?.response?.status !== 404) {
        toast.error(err?.response?.data?.detail || err?.message || 'Failed to load inspection report');
      }
      setInspectionReport(null);
    } finally {
      setReportLoading(false);
    }
  }, []);

  const loadGrv = useCallback(async (lotId) => {
    if (lotId == null) return;
    setGrvLoading(true);
    try {
      const raw = await grvService.list({ lot: lotId });
      const list = normalizeGrvList(raw);
      const rec = pickGrvForLot(list, lotId);
      setGrvRecord(rec);
      if (rec) {
        setGrvId(rec.id);
        setConditionConfirmed(!!rec.condition_confirmed);
        setNotes(rec.notes != null ? String(rec.notes) : '');
      } else {
        setGrvId(null);
        setConditionConfirmed(false);
        setNotes('');
      }
    } catch (err) {
      toast.error(err?.response?.data?.detail || err?.message || 'Failed to load GRV');
      setGrvId(null);
      setGrvRecord(null);
    } finally {
      setGrvLoading(false);
    }
  }, []);

  const loadTemplate = useCallback(async (catId) => {
    if (!catId) {
      setChecklistSections([]);
      setTemplateLoading(false);
      return;
    }
    setTemplateLoading(true);
    try {
      const template = await checklistTemplateService.getForCategory(catId);
      setChecklistSections(templateDataToSections(template?.template_data));
    } catch {
      setChecklistSections([]);
    } finally {
      setTemplateLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialLot?.id) return;
    let cancelled = false;
    (async () => {
      setLoadingLot(true);
      try {
        const data = await auctionService.getLot(initialLot.id);
        if (!cancelled) setLot(data);
      } catch {
        if (!cancelled) setLot(initialLot);
      } finally {
        if (!cancelled) setLoadingLot(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialLot?.id, initialLot]);

  useEffect(() => {
    if (!effectiveLot?.id) return;
    loadInspectionReport(effectiveLot.id);
    loadGrv(effectiveLot.id);
    loadTemplate(categoryId);
  }, [effectiveLot?.id, categoryId, loadInspectionReport, loadGrv, loadTemplate]);

  const hasGrvRecord = grvId != null;
  const fieldsEditable =
    !isFinanceReadOnly &&
    (isAdminGrvRoute || (!hasGrvRecord && canGrvCreate) || (hasGrvRecord && canGrvUpdate));

  const approvalBlockers = useMemo(() => {
    const blockers = [];
    if (!localChecklistFilled && !reportChecklistDone) {
      blockers.push('Complete all checklist items (Pass/Fail/N/A for each item).');
    }
    if (!conditionConfirmed && !reportConditionDone) {
      blockers.push('Confirm lot condition (GRV condition confirmation).');
    }
    if (!checklistSections.length) {
      blockers.push('No active checklist template for this lot category.');
    }
    if (reportApproved) {
      blockers.push('This lot is already approved.');
    }
    return blockers;
  }, [
    localChecklistFilled,
    reportChecklistDone,
    conditionConfirmed,
    reportConditionDone,
    checklistSections.length,
    reportApproved,
  ]);

  const canSubmitApproval =
    canApprove &&
    !reportApproved &&
    checklistSections.length > 0 &&
    (localChecklistFilled || reportChecklistDone) &&
    (conditionConfirmed || reportConditionDone) &&
    overallRating.trim() &&
    initialPrice.trim();

  const handleSaveGrv = async () => {
    const lotId = effectiveLot?.id;
    if (lotId == null) return;
    if (!fieldsEditable) {
      toast.error('You do not have permission to update GRV.');
      return;
    }

    setSavingGrv(true);
    try {
      const checklistCompleted = localChecklistFilled || reportChecklistDone;
      const payload = {
        lot: Number(lotId),
        checklist_completed: checklistCompleted,
        condition_confirmed: conditionConfirmed,
        admin_signed_off: false,
        notes: notes.trim() || '',
      };

      if (hasGrvRecord) {
        await grvService.update(grvId, {
          checklist_completed: checklistCompleted,
          condition_confirmed: conditionConfirmed,
          notes: notes.trim() || '',
        });
        toast.success('GRV progress saved.');
      } else {
        await grvService.create(payload);
        toast.success('GRV record created.');
      }
      await loadGrv(lotId);
      await loadInspectionReport(lotId);
      onGrvChanged?.();
    } catch (err) {
      toast.error(err?.response?.data?.detail || err?.message || 'Failed to save GRV');
    } finally {
      setSavingGrv(false);
    }
  };

  const handleFinalApproval = async () => {
    const lotId = effectiveLot?.id;
    if (!lotId || !canSubmitApproval) return;

    if (!localChecklistFilled && !reportChecklistDone) {
      toast.error('Checklist must be completed before approval.');
      return;
    }
    if (!conditionConfirmed && !reportConditionDone) {
      toast.error('GRV condition must be confirmed before approval.');
      return;
    }

    setApproving(true);
    try {
      const checklistData = buildChecklistData(checklistSections, checklistValues);
      await inspectionService.performManagerInspection(lotId, {
        decision: 'APPROVED',
        checklist_data: checklistData,
        overall_rating: overallRating.trim(),
        admin_feedback: adminFeedback.trim(),
        initial_price: initialPrice.trim(),
        inspection_images: inspectionFiles,
      });
      toast.success('Lot approved successfully.');
      await loadInspectionReport(lotId);
      await loadGrv(lotId);
      onGrvChanged?.();
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data?.message || err?.message;
      toast.error(typeof msg === 'string' ? msg : 'Failed to approve lot');
    } finally {
      setApproving(false);
    }
  };

  const handleDeleteGrv = async () => {
    if (grvId == null || !canGrvDelete) return;
    if (!window.confirm('Delete this GRV report? Continue?')) return;
    setDeleting(true);
    try {
      await grvService.delete(grvId);
      toast.success('GRV deleted.');
      setGrvId(null);
      setGrvRecord(null);
      setConditionConfirmed(false);
      setNotes('');
      onGrvChanged?.();
    } catch (err) {
      toast.error(err?.response?.data?.detail || err?.message || 'Failed to delete GRV');
    } finally {
      setDeleting(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setInspectionFiles((prev) => [...prev, ...files]);
  };

  if (!effectiveLot) return null;

  const dataLoading = reportLoading || grvLoading || templateLoading;

  return (
    <>
      <div className="guest-lot-drawer__backdrop" onClick={onClose} aria-hidden="true" />
      <aside className="guest-lot-drawer" role="dialog" aria-modal="true" aria-label="Checklist and GRV lot details">
        <div className="guest-lot-drawer__inner">
          <header className="guest-lot-drawer__header">
            <button type="button" className="guest-lot-drawer__close" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-5-7 5-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
            <h2 className="guest-lot-drawer__lot-no">Lot #{effectiveLot.lot_number || effectiveLot.id}</h2>
          </header>

          {loadingLot ? (
            <div className="guest-lot-drawer__loading">
              <div className="guest-lot-drawer__spinner" />
              <p>Loading...</p>
            </div>
          ) : (
            <div className="guest-lot-drawer__scroll">
              <div className="guest-lot-drawer__main">
                <div className="guest-lot-drawer__content">
                  <div className="guest-lot-drawer__media">
                    {displayImage ? (
                      <>
                        <div className="guest-lot-drawer__image-wrap">
                          <img src={displayImage} alt={effectiveLot.title || ''} />
                        </div>
                        {imageUrls.length > 1 && (
                          <div className="guest-lot-drawer__thumbs">
                            {imageUrls.map((url, i) => (
                              <button
                                key={i}
                                type="button"
                                className={`guest-lot-drawer__thumb ${i === selectedImage ? 'active' : ''}`}
                                onClick={() => setSelectedImage(i)}
                              >
                                <img src={url} alt="" />
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="guest-lot-drawer__placeholder">📷 No image</div>
                    )}
                  </div>

                  <div className="guest-lot-drawer__body">
                    <h3 className="guest-lot-drawer__title">{effectiveLot.title || 'Untitled'}</h3>
                    <p className="guest-lot-drawer__meta-line">
                      {eventTitle}
                      {effectiveLot.category_name && ` • ${effectiveLot.category_name}`}
                    </p>
                    {effectiveLot.description && (
                      <p className="guest-lot-drawer__desc">{effectiveLot.description}</p>
                    )}
                    {Object.keys(specificData).length > 0 && (
                      <div className="guest-lot-drawer__specs">
                        <h4 className="guest-lot-drawer__section-title">Details</h4>
                        <div className="guest-lot-drawer__spec-list">
                          {Object.entries(specificData).map(([key, value]) => (
                            <div key={key} className="guest-lot-drawer__spec-row">
                              <span className="guest-lot-drawer__spec-key">{formatSpecificKey(key)}</span>
                              <span className="guest-lot-drawer__spec-value">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <aside className="guest-lot-drawer__sidebar">
                  <div className="guest-lot-drawer__bid-card">
                    <div className="guest-lot-drawer__bid">
                      <div className="guest-lot-drawer__bid-icon">!</div>
                      <div>
                        <span className="guest-lot-drawer__bid-label">STARTING PRICE</span>
                        <span className="guest-lot-drawer__bid-value">
                          {currency} {formatPrice(currentBid)}
                        </span>
                      </div>
                    </div>
                    <div className="guest-lot-drawer__bid-not-available">Draft lot · Checklist &amp; GRV</div>
                  </div>
                </aside>
              </div>

              <section className="grv-panel">
                <h4 className="guest-lot-drawer__section-title">Checklist &amp; Goods Receive Verification</h4>

                {dataLoading ? (
                  <p className="guest-lot-drawer__muted">Loading inspection data…</p>
                ) : (
                  <>
                    <div className="grv-status-grid">
                      <div className={`grv-status-card ${reportChecklistDone || localChecklistFilled ? 'done' : 'pending'}`}>
                        <span className="grv-status-card__label">Checklist</span>
                        <strong>{reportChecklistDone || localChecklistFilled ? 'Complete' : 'Incomplete'}</strong>
                      </div>
                      <div className={`grv-status-card ${reportConditionDone || conditionConfirmed ? 'done' : 'pending'}`}>
                        <span className="grv-status-card__label">GRV / Condition</span>
                        <strong>{reportConditionDone || conditionConfirmed ? 'Confirmed' : 'Pending'}</strong>
                      </div>
                      <div className={`grv-status-card ${reportApproved ? 'done' : 'pending'}`}>
                        <span className="grv-status-card__label">Approval</span>
                        <strong>{reportApproved ? 'Approved' : String(inspectionReport?.status || grvRecord?.status || 'Draft')}</strong>
                      </div>
                    </div>

                    {!checklistSections.length && (
                      <p className="grv-panel__warning">
                        No active checklist template for category &ldquo;{effectiveLot.category_name || 'Unknown'}&rdquo;.
                        Configure one in Category Details.
                      </p>
                    )}

                    {checklistSections.length > 0 && !reportApproved && (
                      <div className="grv-checklist-form">
                        <h5>Inspection checklist</h5>
                        {checklistSections.map((section) => (
                          <div key={section.id} className="grv-checklist-section">
                            <h6>{section.name.replace(/_/g, ' ')}</h6>
                            {section.items.map((item) => {
                              const key = `${section.name}::${item.name}`;
                              return (
                                <label key={item.id} className="grv-checklist-item">
                                  <span>{item.name.replace(/_/g, ' ')}</span>
                                  <select
                                    value={checklistValues[key] || ''}
                                    onChange={(e) =>
                                      setChecklistValues((prev) => ({ ...prev, [key]: e.target.value }))
                                    }
                                    disabled={!fieldsEditable || reportApproved}
                                  >
                                    <option value="">Select…</option>
                                    {PASS_FAIL_OPTIONS.map((opt) => (
                                      <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                </label>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grv-grv-section">
                      <h5>Goods receive verification</h5>
                      <label className="grv-panel__check">
                        <input
                          type="checkbox"
                          checked={conditionConfirmed}
                          onChange={(e) => setConditionConfirmed(e.target.checked)}
                          disabled={!fieldsEditable || reportApproved}
                        />
                        <span>Condition confirmed</span>
                      </label>
                      <label className="grv-panel__notes-label" htmlFor="grv-notes">
                        Notes
                      </label>
                      <textarea
                        id="grv-notes"
                        className="grv-panel__notes"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Optional GRV notes…"
                        readOnly={!fieldsEditable || reportApproved}
                      />
                    </div>

                    {!reportApproved && fieldsEditable && (
                      <div className="grv-panel__actions">
                        <button
                          type="button"
                          className="grv-panel__btn grv-panel__btn--secondary"
                          onClick={handleSaveGrv}
                          disabled={savingGrv}
                        >
                          {savingGrv ? 'Saving…' : 'Save progress'}
                        </button>
                        {hasGrvRecord && canGrvDelete && (
                          <button
                            type="button"
                            className="grv-panel__btn grv-panel__btn--danger"
                            onClick={handleDeleteGrv}
                            disabled={deleting}
                          >
                            {deleting ? 'Deleting…' : 'Delete GRV'}
                          </button>
                        )}
                      </div>
                    )}

                    {!reportApproved && canApprove && (
                      <div className="grv-approval-section">
                        <h5>Final lot approval</h5>
                        <p className="grv-panel__hint">
                          Both checklist and GRV condition must be complete before approval.
                        </p>

                        {approvalBlockers.length > 0 && (
                          <ul className="grv-blockers">
                            {approvalBlockers.map((msg) => (
                              <li key={msg}>{msg}</li>
                            ))}
                          </ul>
                        )}

                        <div className="grv-approval-fields">
                          <label>
                            Overall rating *
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              value={overallRating}
                              onChange={(e) => setOverallRating(e.target.value)}
                              placeholder="e.g. 9.0"
                            />
                          </label>
                          <label>
                            Initial price *
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={initialPrice}
                              onChange={(e) => setInitialPrice(e.target.value)}
                              placeholder="e.g. 12500.00"
                            />
                          </label>
                          <label className="grv-approval-fields__full">
                            Admin feedback
                            <textarea
                              rows={3}
                              value={adminFeedback}
                              onChange={(e) => setAdminFeedback(e.target.value)}
                              placeholder="Passed inspection. Approved for live bidding."
                            />
                          </label>
                          <label className="grv-approval-fields__full">
                            Inspection images
                            <input type="file" accept="image/*" multiple onChange={handleFileUpload} />
                            {inspectionFiles.length > 0 && (
                              <span className="grv-file-count">{inspectionFiles.length} file(s) selected</span>
                            )}
                          </label>
                        </div>

                        <button
                          type="button"
                          className="grv-panel__btn grv-panel__btn--primary"
                          onClick={handleFinalApproval}
                          disabled={!canSubmitApproval || approving}
                          title={!canSubmitApproval ? approvalBlockers.join(' ') : undefined}
                        >
                          {approving ? 'Approving…' : 'Approve lot'}
                        </button>
                      </div>
                    )}

                    {reportApproved && inspectionReport?.inspector_name && (
                      <p className="grv-panel__badge">
                        Approved by {inspectionReport.inspector_name}
                        {inspectionReport.overall_rating ? ` · Rating ${inspectionReport.overall_rating}` : ''}
                      </p>
                    )}
                  </>
                )}
              </section>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default GrvLotDrawer;
