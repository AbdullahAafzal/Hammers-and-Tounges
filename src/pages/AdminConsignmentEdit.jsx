import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { adminService } from '../services/interceptors/admin.service';
import { auctionService } from '../services/interceptors/auction.service';
import { getMediaUrl } from '../config/api.config';
import { canViewConsignmentTab } from '../utils/financeAccess';
import {
  sanitizeDecimalPriceInput,
  sanitizeDigitsOnly,
  sanitizeYearInput,
} from '../utils/numericFormInput';
import { formatSellerLabel } from '../utils/sellerUtils';
import './AdminConsignmentIntake.css';

const MAX_IMAGES = 8;
const MAX_FILES = 4;

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

const isImageMedia = (media) => {
  const type = String(media?.media_type ?? media?.type ?? '').toLowerCase();
  const file = String(media?.file ?? '');
  if (type.includes('image')) return true;
  return /\.(jpe?g|png|gif|webp|heic|avif|bmp)$/i.test(file);
};

const isDocumentMedia = (media) => !isImageMedia(media);

const mapLotToForm = (lotData) => {
  let sd = lotData?.specific_data;
  if (typeof sd === 'string') {
    try {
      sd = JSON.parse(sd) || {};
    } catch {
      sd = {};
    }
  }
  const images = [];
  const documents = [];
  (Array.isArray(lotData?.media) ? lotData.media : []).forEach((m, i) => {
    const url = getMediaUrl(m?.file);
    if (!url) return;
    if (isImageMedia(m)) {
      images.push({
        id: `existing-img-${m.id || i}`,
        isExisting: true,
        preview: url,
        label: m.label || `Image ${images.length + 1}`,
      });
    } else if (isDocumentMedia(m)) {
      documents.push({
        id: `existing-doc-${m.id || i}`,
        isExisting: true,
        label: m.label || m.file?.split('/').pop() || `Document ${documents.length + 1}`,
        preview: url,
      });
    }
  });
  return {
    sellerId: String(lotData?.seller ?? lotData?.seller_id ?? ''),
    sellerLabel: lotData?.seller_name || formatSellerLabel(lotData?.seller_details) || 'Seller',
    title: lotData?.title || '',
    description: lotData?.description || '',
    category: String(lotData?.category ?? lotData?.category_id ?? ''),
    initialPrice: lotData?.initial_price != null ? String(lotData.initial_price) : '',
    reservePrice: lotData?.reserve_price != null ? String(lotData.reserve_price) : '',
    stcEligible: Boolean(lotData?.stc_eligible),
    specificData: sd && typeof sd === 'object' ? sd : {},
    images,
    documents,
  };
};

export default function AdminConsignmentEdit({ isManagerFlow = false }) {
  const { lotId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = useSelector((state) => state.auth?.user);
  const canView = canViewConsignmentTab(authUser, { isManagerFlow });
  const consignmentPath = isManagerFlow ? '/manager/consignment' : '/admin/consignment';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [sellerId, setSellerId] = useState('');
  const [sellerLabel, setSellerLabel] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [initialPrice, setInitialPrice] = useState('');
  const [reservePrice, setReservePrice] = useState('');
  const [stcEligible, setStcEligible] = useState(false);
  const [specificData, setSpecificData] = useState({});
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);

  const selectedCategory = categories.find((c) => String(c.id) === String(category));
  const validationSchema = selectedCategory?.validation_schema || {};

  useEffect(() => {
    if (!canView || !lotId) return undefined;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [lotData, catsRaw] = await Promise.all([
          auctionService.getLot(lotId),
          adminService.getCategories(),
        ]);
        if (cancelled) return;
        const catList = Array.isArray(catsRaw) ? catsRaw : catsRaw?.results || [];
        setCategories(catList.filter((c) => c.is_active !== false));
        const mapped = mapLotToForm(lotData);
        setSellerId(mapped.sellerId);
        setSellerLabel(mapped.sellerLabel);
        setTitle(mapped.title);
        setDescription(mapped.description);
        setCategory(mapped.category);
        setInitialPrice(mapped.initialPrice);
        setReservePrice(mapped.reservePrice);
        setStcEligible(mapped.stcEligible);
        setSpecificData(mapped.specificData);
        setImages(mapped.images);
        setDocuments(mapped.documents);
      } catch (err) {
        if (!cancelled) {
          toast.error(parseError(err));
          navigate(consignmentPath, { replace: true });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [canView, lotId, navigate, consignmentPath]);

  const handleSpecificDataChange = useCallback((fieldName, value) => {
    setSpecificData((prev) => ({ ...prev, [fieldName]: value }));
  }, []);

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

  const onDocumentChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const next = files.slice(0, MAX_FILES - documents.length).map((file, idx) => ({
      id: `${Date.now()}-doc-${idx}`,
      file,
      label: file.name || `Document ${documents.length + idx + 1}`,
    }));
    setDocuments((prev) => [...prev, ...next].slice(0, MAX_FILES));
    e.target.value = '';
  };

  const buildEditFormData = () => {
    const fd = new FormData();
    fd.append('seller', sellerId);
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
    images.forEach((img) => {
      if (img.file instanceof File) {
        fd.append('images', img.file);
      }
    });
    let fileIdx = 1;
    documents.forEach((doc) => {
      if (doc.file instanceof File) {
        fd.append(`file_${fileIdx}`, doc.file);
        fd.append('media_labels', doc.label || `Document ${fileIdx}`);
        fileIdx += 1;
      }
    });
    return fd;
  };

  const onSave = async () => {
    if (!sellerId) {
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
    setSaving(true);
    try {
      await auctionService.patchLotFormData(lotId, buildEditFormData());
      toast.success('Consignment lot updated');
      navigate(consignmentPath, { replace: true, state: { refreshAt: Date.now() } });
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setSaving(false);
    }
  };

  const lotLabel = useMemo(
    () => location.state?.lot?.lot_number || location.state?.lot?.id || lotId,
    [location.state?.lot, lotId]
  );

  if (!canView) {
    const redirectTo = isManagerFlow ? '/manager/dashboard' : '/admin/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  if (loading) {
    return (
      <div className="consignment-intake" role="main">
        <p className="consignment-intake__hint">Loading lot…</p>
      </div>
    );
  }

  return (
    <div className="consignment-intake" role="main">
      <header className="consignment-intake__header">
        <button
          type="button"
          className="consignment-intake__back"
          onClick={() => navigate(consignmentPath)}
        >
          ← Back
        </button>
        <h1 className="consignment-intake__title">Edit consignment lot #{lotLabel}</h1>
      </header>

      <div className="consignment-intake__body">
        <section className="consignment-intake__section">
          <p className="consignment-intake__hint">
            Update lot details. Status and event assignment cannot be changed here.
          </p>

          <label className="consignment-intake__field">
            <span>Seller</span>
            <input className="consignment-intake__input" value={sellerLabel} readOnly disabled />
          </label>

          <label className="consignment-intake__field">
            <span>Title *</span>
            <input
              className="consignment-intake__input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="consignment-intake__field">
            <span>Description *</span>
            <textarea
              className="consignment-intake__textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            />
          </label>

          <label className="consignment-intake__field">
            <span>Reserve price</span>
            <input
              className="consignment-intake__input"
              inputMode="decimal"
              value={reservePrice}
              onChange={(e) => setReservePrice(sanitizeDecimalPriceInput(e.target.value))}
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
                      if (img.preview && !img.isExisting) URL.revokeObjectURL(img.preview);
                      setImages((prev) => prev.filter((x) => x.id !== img.id));
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          <label className="consignment-intake__field">
            <span>Documents ({documents.length}/{MAX_FILES})</span>
            <input type="file" multiple onChange={onDocumentChange} />
          </label>
          {documents.length > 0 ? (
            <ul className="consignment-intake__doc-list">
              {documents.map((doc) => (
                <li key={doc.id}>
                  <span>{doc.label}</span>
                  <button
                    type="button"
                    aria-label="Remove document"
                    onClick={() => setDocuments((prev) => prev.filter((x) => x.id !== doc.id))}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <button
            type="button"
            className="consignment-intake__btn primary consignment-intake__submit-lot"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </section>
      </div>
    </div>
  );
}
