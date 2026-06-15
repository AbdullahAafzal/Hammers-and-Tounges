import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { adminService } from '../services/interceptors/admin.service';
import { auctionService } from '../services/interceptors/auction.service';
import { canViewConsignmentTab } from '../utils/financeAccess';
import {
  sanitizeDecimalPriceInput,
  sanitizeDigitsOnly,
  sanitizeYearInput,
} from '../utils/numericFormInput';
import {
  formatSellerLabel,
  normalizeSellerSearchResults,
  resolveIntakeSessionId,
  resolveSellerId,
} from '../utils/sellerUtils';
import './AdminConsignmentIntake.css';

const STEPS = { SELLER: 1, LOTS: 2 };
const MAX_IMAGES = 8;

const formatFieldLabel = (fieldName) =>
  fieldName
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const parseError = (err) => {
  const d = err?.response?.data;
  if (typeof d === 'string') return d;
  if (d?.detail) {
    return Array.isArray(d.detail) ? d.detail.map((x) => x?.msg || x).join(' ') : String(d.detail);
  }
  return err?.message || 'Something went wrong';
};

const AdminConsignmentIntake = ({ isManagerFlow = false }) => {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth?.user);
  const canView = canViewConsignmentTab(authUser, { isManagerFlow });
  const consignmentPath = isManagerFlow ? '/manager/consignment' : '/admin/consignment';

  const [step, setStep] = useState(STEPS.SELLER);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [createSellerModalOpen, setCreateSellerModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [busy, setBusy] = useState(false);

  const [session, setSession] = useState(null);
  const [sessionLots, setSessionLots] = useState([]);
  const [loadingLotData, setLoadingLotData] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [initialPrice, setInitialPrice] = useState('');
  const [reservePrice, setReservePrice] = useState('');
  const [stcEligible, setStcEligible] = useState(false);
  const [specificData, setSpecificData] = useState({});
  const [images, setImages] = useState([]);
  const [sellerApproval, setSellerApproval] = useState(false);

  const sessionId = session?.id ?? resolveIntakeSessionId(session);
  const selectedSellerId = resolveSellerId(selectedSeller);
  const selectedSellerLabel = useMemo(
    () => (selectedSeller ? formatSellerLabel(selectedSeller) : ''),
    [selectedSeller]
  );

  const selectedCategory = categories.find((c) => String(c.id) === String(category));
  const validationSchema = selectedCategory?.validation_schema || {};

  useEffect(() => {
    if (step !== STEPS.LOTS) return undefined;
    let cancelled = false;
    (async () => {
      setLoadingLotData(true);
      try {
        const catsRaw = await adminService.getCategories();
        if (cancelled) return;
        const catList = Array.isArray(catsRaw) ? catsRaw : catsRaw?.results || [];
        setCategories(catList.filter((c) => c.is_active !== false));
      } catch (err) {
        if (!cancelled) toast.error(parseError(err));
      } finally {
        if (!cancelled) setLoadingLotData(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [step]);

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await adminService.searchSellers(q);
        if (!cancelled) setSearchResults(normalizeSellerSearchResults(res));
      } catch (err) {
        if (!cancelled) {
          setSearchResults([]);
          toast.error(parseError(err));
        }
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  if (!canView) {
    return <Navigate to={isManagerFlow ? '/manager/dashboard' : '/admin/dashboard'} replace />;
  }

  const closeCreateSellerModal = () => {
    if (busy) return;
    setCreateSellerModalOpen(false);
  };

  const onQuickCreateSeller = async () => {
    if (!createForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.email)) {
      toast.error('Valid email required');
      return;
    }
    if (!createForm.first_name.trim() || !createForm.last_name.trim()) {
      toast.error('First and last name required');
      return;
    }
    setBusy(true);
    try {
      const created = await adminService.quickCreateSeller(createForm);
      setSelectedSeller(created);
      setCreateForm({ first_name: '', last_name: '', email: '', phone: '' });
      setCreateSellerModalOpen(false);
      toast.success('Seller created');
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setBusy(false);
    }
  };

  const onStartSession = async () => {
    const sellerId = resolveSellerId(selectedSeller);
    if (!sellerId) {
      toast.error('Select a seller to continue');
      return;
    }
    setBusy(true);
    try {
      const data = await auctionService.createIntakeSession(sellerId);
      const id = resolveIntakeSessionId(data, sellerId) ?? data?.id;
      if (!id) throw new Error('Could not start intake session');
      setSession({ ...data, id });
      setSessionLots(Array.isArray(data?.lots) ? data.lots : []);
      setStep(STEPS.LOTS);
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSpecificDataChange = useCallback((fieldName, value) => {
    setSpecificData((prev) => ({ ...prev, [fieldName]: value }));
  }, []);

  const resetLotForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setInitialPrice('');
    setReservePrice('');
    setStcEligible(false);
    setSpecificData({});
    images.forEach((img) => {
      if (img.preview) URL.revokeObjectURL(img.preview);
    });
    setImages([]);
  };

  const renderSpecificField = (fieldName, fieldConfig) => {
    const label = formatFieldLabel(fieldName);
    const value = specificData[fieldName];
    const isRequired = fieldConfig.required;

    if (fieldConfig.enum && Array.isArray(fieldConfig.enum)) {
      return (
        <label key={fieldName} className="consignment-intake__field">
          <span>
            {label}
            {isRequired ? ' *' : ''}
          </span>
          <select
            className="consignment-intake__select"
            value={value ?? ''}
            onChange={(e) => handleSpecificDataChange(fieldName, e.target.value)}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {fieldConfig.enum.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      );
    }

    if (fieldConfig.type === 'textarea') {
      return (
        <label key={fieldName} className="consignment-intake__field">
          <span>
            {label}
            {isRequired ? ' *' : ''}
          </span>
          <textarea
            className="consignment-intake__textarea"
            value={value ?? ''}
            onChange={(e) => handleSpecificDataChange(fieldName, e.target.value)}
            rows={3}
          />
        </label>
      );
    }

    if (fieldName.toLowerCase() === 'year' || fieldName.toLowerCase() === 'model_year') {
      return (
        <label key={fieldName} className="consignment-intake__field">
          <span>
            {label}
            {isRequired ? ' *' : ''}
          </span>
          <input
            className="consignment-intake__input"
            inputMode="numeric"
            maxLength={4}
            value={value ?? ''}
            onChange={(e) => handleSpecificDataChange(fieldName, sanitizeYearInput(e.target.value))}
          />
        </label>
      );
    }

    if (fieldConfig.type === 'number' || fieldConfig.type === 'integer') {
      return (
        <label key={fieldName} className="consignment-intake__field">
          <span>
            {label}
            {isRequired ? ' *' : ''}
          </span>
          <input
            className="consignment-intake__input"
            inputMode={fieldConfig.type === 'integer' ? 'numeric' : 'decimal'}
            value={value ?? ''}
            onChange={(e) =>
              handleSpecificDataChange(
                fieldName,
                fieldConfig.type === 'integer'
                  ? sanitizeDigitsOnly(e.target.value)
                  : sanitizeDecimalPriceInput(e.target.value)
              )
            }
          />
        </label>
      );
    }

    return (
      <label key={fieldName} className="consignment-intake__field">
        <span>
          {label}
          {isRequired ? ' *' : ''}
        </span>
        <input
          className="consignment-intake__input"
          value={value ?? ''}
          onChange={(e) => handleSpecificDataChange(fieldName, e.target.value)}
        />
      </label>
    );
  };

  const onImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const next = files.slice(0, MAX_IMAGES - images.length).map((file, idx) => ({
      id: `${Date.now()}-${idx}`,
      file,
      label: images.length + idx === 0 ? 'Front View' : `Image ${images.length + idx + 1}`,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...next].slice(0, MAX_IMAGES));
    e.target.value = '';
  };

  const buildLotFormData = () => {
    const fd = new FormData();
    fd.append('seller', String(selectedSellerId));
    fd.append('title', title.trim());
    fd.append('description', description.trim());
    fd.append('category', category);
    fd.append('initial_price', initialPrice || '0');
    fd.append('reserve_price', reservePrice || '0');
    fd.append('stc_eligible', stcEligible ? 'true' : 'false');
    fd.append(
      'specific_data',
      JSON.stringify(specificData && typeof specificData === 'object' ? specificData : {})
    );
    images.forEach((img, idx) => {
      if (img.file instanceof File) {
        fd.append(`image_${idx + 1}`, img.file);
        fd.append('media_labels', img.label || `Image ${idx + 1}`);
      }
    });
    return fd;
  };

  const onSaveConsignment = async () => {
    if (!sessionId) return;
    if (!sellerApproval) {
      toast.error('Seller approval (signature) is required');
      return;
    }
    if (!selectedSellerId) {
      toast.error('Seller is required');
      return;
    }
    if (!title.trim() || !description.trim() || !category) {
      toast.error('Title, description, and category are required');
      return;
    }
    const initial = parseFloat(initialPrice);
    if (isNaN(initial) || initial < 0) {
      toast.error('Enter a valid initial price');
      return;
    }
    setBusy(true);
    try {
      await auctionService.addIntakeLot(sessionId, buildLotFormData());
      await auctionService.completeIntakeSession(sessionId, sellerApproval);
      toast.success('Consignment saved');
      navigate(consignmentPath, { replace: true, state: { refreshAt: Date.now() } });
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="consignment-intake" role="main">
      <header className="consignment-intake__header">
        <button
          type="button"
          className="consignment-intake__back"
          onClick={() => (step === STEPS.LOTS ? setStep(STEPS.SELLER) : navigate(consignmentPath))}
        >
          ← Back
        </button>
        <h1 className="consignment-intake__title">New consignment</h1>
      </header>

      <div className="consignment-intake__body">
        {step === STEPS.SELLER ? (
          <section className="consignment-intake__section">
            <div className="consignment-intake__step-header">
              <h2 className="consignment-intake__step-title">Step 1 — Select seller</h2>
              <div className="consignment-intake__step-header-actions">
                <button
                  type="button"
                  className="consignment-intake__link-btn"
                  onClick={() => setCreateSellerModalOpen(true)}
                >
                  + Create new seller
                </button>
                <button
                  type="button"
                  className="consignment-intake__btn primary consignment-intake__btn--header"
                  onClick={onStartSession}
                  disabled={!selectedSeller || busy}
                >
                  {busy ? 'Starting…' : 'Continue'}
                </button>
              </div>
            </div>
            <p className="consignment-intake__hint">
              Search by name, email, or phone. Up to 10 results.
            </p>
            <input
              type="search"
              className="consignment-intake__input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sellers…"
              aria-label="Search sellers"
            />
            {searching ? <p className="consignment-intake__hint">Searching…</p> : null}
            <div className="consignment-intake__seller-list">
              {searchResults.map((seller) => {
                const id = resolveSellerId(seller);
                const isSelected = selectedSeller && resolveSellerId(selectedSeller) === id;
                return (
                  <button
                    key={String(id ?? seller.email)}
                    type="button"
                    className={`consignment-intake__seller-card${isSelected ? ' selected' : ''}`}
                    onClick={() => setSelectedSeller(seller)}
                  >
                    <strong>{formatSellerLabel(seller)}</strong>
                    {seller.email ? <span>{seller.email}</span> : null}
                    {seller.phone ? <span>{seller.phone}</span> : null}
                  </button>
                );
              })}
            </div>
            {selectedSeller ? (
              <div className="consignment-intake__selected">
                Selected: <strong>{selectedSellerLabel}</strong>
              </div>
            ) : null}
          </section>
        ) : loadingLotData ? (
          <p className="consignment-intake__hint">Loading lot form…</p>
        ) : (
          <section className="consignment-intake__section">
            <h2 className="consignment-intake__step-title">Step 2 — Lot details</h2>
            <p className="consignment-intake__hint">
              Session #{sessionId} · Seller: {selectedSellerLabel}
            </p>

            <h3 className="consignment-intake__subsection-title">Basics</h3>

            <label className="consignment-intake__field">
              <span>Seller</span>
              <input className="consignment-intake__input" value={selectedSellerLabel} readOnly />
            </label>

            <label className="consignment-intake__field">
              <span>Title *</span>
              <input
                className="consignment-intake__input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 2015 Toyota Hilux"
              />
            </label>

            <label className="consignment-intake__field">
              <span>Description *</span>
              <textarea
                className="consignment-intake__textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the item"
                rows={4}
              />
            </label>

            <label className="consignment-intake__field">
              <span>Category *</span>
              <select
                className="consignment-intake__select"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSpecificData({});
                }}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name || c.slug || `Category #${c.id}`}
                  </option>
                ))}
              </select>
            </label>

            {Object.keys(validationSchema).length > 0 ? (
              <>
                <h3 className="consignment-intake__subsection-title">Category details</h3>
                {Object.entries(validationSchema).map(([fn, fc]) => renderSpecificField(fn, fc))}
              </>
            ) : null}

            <h3 className="consignment-intake__subsection-title">Pricing</h3>

            <label className="consignment-intake__field">
              <span>Initial price *</span>
              <input
                className="consignment-intake__input"
                inputMode="decimal"
                value={initialPrice}
                onChange={(e) => setInitialPrice(sanitizeDecimalPriceInput(e.target.value))}
                placeholder="0.00"
              />
            </label>

            <label className="consignment-intake__field">
              <span>Reserve price</span>
              <input
                className="consignment-intake__input"
                inputMode="decimal"
                value={reservePrice}
                onChange={(e) => setReservePrice(sanitizeDecimalPriceInput(e.target.value))}
                placeholder="Optional"
              />
            </label>

            <label className="consignment-intake__checkbox">
              <input
                type="checkbox"
                checked={stcEligible}
                onChange={(e) => setStcEligible(e.target.checked)}
              />
              STC eligible
            </label>

            <label className="consignment-intake__field">
              <span>Photos ({images.length}/{MAX_IMAGES})</span>
              <input type="file" accept="image/*" multiple onChange={onImageChange} />
            </label>
            {images.length > 0 ? (
              <div className="consignment-intake__previews">
                {images.map((img) => (
                  <div key={img.id} className="consignment-intake__preview">
                    <img src={img.preview} alt="" />
                    <button
                      type="button"
                      aria-label="Remove image"
                      onClick={() => {
                        if (img.preview) URL.revokeObjectURL(img.preview);
                        setImages((prev) => prev.filter((x) => x.id !== img.id));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <label className="consignment-intake__checkbox">
              <input
                type="checkbox"
                checked={sellerApproval}
                onChange={(e) => setSellerApproval(e.target.checked)}
              />
              Seller approval (signature) *
            </label>

            <button
              type="button"
              className="consignment-intake__btn primary consignment-intake__submit-lot"
              onClick={onSaveConsignment}
              disabled={busy || !sellerApproval}
            >
              {busy ? 'Saving…' : 'Save consignment'}
            </button>
          </section>
        )}
      </div>

      {createSellerModalOpen ? (
        <div
          className="consignment-intake__modal-overlay"
          role="presentation"
          onClick={closeCreateSellerModal}
        >
          <div
            className="consignment-intake__modal"
            role="dialog"
            aria-labelledby="create-seller-modal-title"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="consignment-intake__modal-header">
              <h2 id="create-seller-modal-title" className="consignment-intake__modal-title">
                Create new seller
              </h2>
              <button
                type="button"
                className="consignment-intake__modal-close"
                onClick={closeCreateSellerModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="consignment-intake__modal-body">
              {['first_name', 'last_name', 'email', 'phone'].map((key) => (
                <label key={key} className="consignment-intake__field">
                  <span>{key.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                  <input
                    type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                    className="consignment-intake__input"
                    value={createForm[key]}
                    onChange={(e) => setCreateForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={key.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  />
                </label>
              ))}
              <div className="consignment-intake__modal-actions">
                <button
                  type="button"
                  className="consignment-intake__btn secondary"
                  onClick={closeCreateSellerModal}
                  disabled={busy}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="consignment-intake__btn primary"
                  onClick={onQuickCreateSeller}
                  disabled={busy}
                >
                  {busy ? 'Creating…' : 'Create seller'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminConsignmentIntake;
