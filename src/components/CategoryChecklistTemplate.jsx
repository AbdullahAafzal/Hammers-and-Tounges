import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { checklistTemplateService } from '../services/interceptors/checklistTemplate.service';
import './CategoryChecklistTemplate.css';

const emptySection = () => ({ id: Date.now(), name: '', items: [''] });

const sectionsToTemplateData = (sections) => {
  const data = {};
  sections.forEach((section) => {
    const name = section.name.trim();
    if (!name) return;
    const items = (section.items || [])
      .map((item) => (typeof item === 'string' ? item.trim() : String(item?.name || item).trim()))
      .filter(Boolean);
    if (items.length) data[name] = items;
  });
  return data;
};

const templateDataToSections = (templateData) => {
  if (!templateData || typeof templateData !== 'object') return [emptySection()];
  const entries = Object.entries(templateData);
  if (!entries.length) return [emptySection()];
  return entries.map(([name, items], index) => ({
    id: Date.now() + index,
    name,
    items: Array.isArray(items) && items.length ? items.map(String) : [''],
  }));
};

/**
 * Checklist template CRUD for a category (Category Details / Product Fields screen).
 * Initial template data comes from category detail API (`checklist_template`), not a separate list call.
 */
export default function CategoryChecklistTemplate({
  categoryId,
  categoryName,
  canEdit = true,
  checklistTemplate = null,
  loading: checklistLoading = false,
  onRefresh,
}) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [template, setTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState([emptySection()]);

  const applyTemplate = useCallback(
    (found) => {
      setTemplate(found);
      if (found) {
        setTitle(found.title || `${categoryName || 'Category'} Inspection`);
        setDescription(found.description || '');
        setSections(templateDataToSections(found.template_data));
      } else {
        setTitle(`${categoryName || 'Category'} Inspection Protocol`);
        setDescription('');
        setSections([emptySection()]);
      }
    },
    [categoryName]
  );

  useEffect(() => {
    if (!categoryId) {
      setTemplate(null);
      return;
    }
    applyTemplate(checklistTemplate ?? null);
  }, [categoryId, checklistTemplate, applyTemplate]);

  const startCreate = () => {
    setIsEditing(true);
    setTitle(`${categoryName || 'Category'} Inspection Protocol`);
    setDescription('');
    setSections([emptySection()]);
  };

  const startEdit = () => {
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    if (template) {
      setTitle(template.title || '');
      setDescription(template.description || '');
      setSections(templateDataToSections(template.template_data));
    } else {
      setTitle(`${categoryName || 'Category'} Inspection Protocol`);
      setDescription('');
      setSections([emptySection()]);
    }
  };

  const handleSave = async () => {
    if (!categoryId) {
      toast.error('Save the category first before creating a checklist template.');
      return;
    }
    const templateData = sectionsToTemplateData(sections);
    if (!Object.keys(templateData).length) {
      toast.error('Add at least one section with checklist items.');
      return;
    }
    if (!title.trim()) {
      toast.error('Template title is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        category: Number(categoryId),
        description: description.trim(),
        template_data: templateData,
        is_active: true,
      };

      if (template?.id) {
        await checklistTemplateService.update(template.id, payload);
        toast.success('Checklist template updated.');
      } else {
        await checklistTemplateService.create(payload);
        toast.success('Checklist template created.');
      }
      setIsEditing(false);
      await onRefresh?.();
    } catch (err) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;
      if (status === 401) {
        toast.error('Session expired. Please sign out and sign in again.');
        return;
      }
      const msg = detail || err?.response?.data?.message || err?.message;
      toast.error(typeof msg === 'string' ? msg : 'Failed to save checklist template');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (!template?.id || !canEdit) return;
    setSaving(true);
    try {
      await checklistTemplateService.patch(template.id, { is_active: !template.is_active });
      toast.success(template.is_active ? 'Template deactivated.' : 'Template activated.');
      await onRefresh?.();
    } catch (err) {
      toast.error(err?.response?.data?.detail || err?.message || 'Failed to update template status');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!template?.id || !canEdit) return;
    if (!window.confirm('Delete this checklist template? Lots in this category will need a new template.')) return;
    setDeleting(true);
    try {
      await checklistTemplateService.delete(template.id);
      toast.success('Checklist template deleted.');
      setTemplate(null);
      setIsEditing(false);
      setSections([emptySection()]);
      await onRefresh?.();
    } catch (err) {
      toast.error(err?.response?.data?.detail || err?.message || 'Failed to delete template');
    } finally {
      setDeleting(false);
    }
  };

  const updateSection = (sectionId, patch) => {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)));
  };

  const addSection = () => setSections((prev) => [...prev, emptySection()]);

  const removeSection = (sectionId) => {
    setSections((prev) => (prev.length <= 1 ? prev : prev.filter((s) => s.id !== sectionId)));
  };

  const updateItem = (sectionId, itemIndex, value) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const items = [...s.items];
        items[itemIndex] = value;
        return { ...s, items };
      })
    );
  };

  const addItem = (sectionId) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, items: [...s.items, ''] } : s))
    );
  };

  const removeItem = (sectionId, itemIndex) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const items = s.items.filter((_, i) => i !== itemIndex);
        return { ...s, items: items.length ? items : [''] };
      })
    );
  };

  if (!categoryId) {
    return (
      <section className="category-checklist section-card">
        <h3 className="section-title">Checklist Template</h3>
        <p className="category-checklist__required">
          Save the category first, then create a required checklist template here.
        </p>
      </section>
    );
  }

  return (
    <section className="category-checklist section-card">
      <div className="section-header">
        <div>
          <h3 className="section-title">Checklist Template</h3>
          <p className="section-description">
            Required for category configuration. Lots use this template during inspection and GRV approval.
          </p>
        </div>
        {template && !isEditing && (
          <span className={`category-checklist__status ${template.is_active !== false ? 'active' : 'inactive'}`}>
            {template.is_active !== false ? 'Active' : 'Inactive'}
          </span>
        )}
      </div>

      {checklistLoading ? (
        <p className="category-checklist__loading">Loading checklist template…</p>
      ) : !template && !isEditing ? (
        <div className="category-checklist__empty">
          <p className="category-checklist__required">No checklist template — category is not fully configured.</p>
          {canEdit && (
            <button type="button" className="category-checklist__cta" onClick={startCreate}>
              Create Checklist Template
            </button>
          )}
        </div>
      ) : isEditing ? (
        <div className="category-checklist__form">
          <label className="category-checklist__label">
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!canEdit}
            />
          </label>
          <label className="category-checklist__label">
            Description
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!canEdit}
            />
          </label>

          <div className="category-checklist__sections">
            <h4>Sections &amp; items</h4>
            {sections.map((section) => (
              <div key={section.id} className="category-checklist__section">
                <input
                  type="text"
                  className="category-checklist__section-name"
                  placeholder="Section name (e.g. cabin)"
                  value={section.name}
                  onChange={(e) => updateSection(section.id, { name: e.target.value })}
                  disabled={!canEdit}
                />
                {section.items.map((item, idx) => (
                  <div key={`${section.id}-${idx}`} className="category-checklist__item-row">
                    <input
                      type="text"
                      placeholder="Checklist item"
                      value={item}
                      onChange={(e) => updateItem(section.id, idx, e.target.value)}
                      disabled={!canEdit}
                    />
                    {canEdit && section.items.length > 1 && (
                      <button type="button" onClick={() => removeItem(section.id, idx)} aria-label="Remove item">
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {canEdit && (
                  <div className="category-checklist__section-actions">
                    <button type="button" onClick={() => addItem(section.id)}>+ Add item</button>
                    <button type="button" onClick={() => removeSection(section.id)}>Remove section</button>
                  </div>
                )}
              </div>
            ))}
            {canEdit && (
              <button type="button" className="category-checklist__add-section" onClick={addSection}>
                + Add section
              </button>
            )}
          </div>

          {canEdit && (
            <div className="category-checklist__actions">
              <button type="button" className="field-secondary-btn" onClick={cancelEdit} disabled={saving}>
                Cancel
              </button>
              <button type="button" className="primary-action-btn field-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : template ? 'Save template' : 'Create template'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="category-checklist__view">
          <h4>{template.title}</h4>
          {template.description && <p>{template.description}</p>}
          <ul className="category-checklist__preview">
            {Object.entries(template.template_data || {}).map(([section, items]) => (
              <li key={section}>
                <strong>{section.replace(/_/g, ' ')}</strong>
                <span>{Array.isArray(items) ? items.join(', ') : String(items)}</span>
              </li>
            ))}
          </ul>
          {canEdit && (
            <div className="category-checklist__actions">
              <button type="button" className="field-secondary-btn" onClick={startEdit}>Edit</button>
              <button type="button" className="field-secondary-btn" onClick={handleToggleActive} disabled={saving}>
                {template.is_active !== false ? 'Deactivate' : 'Activate'}
              </button>
              <button type="button" className="category-checklist__delete" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export function categoryHasActiveChecklist(template) {
  return template != null && template.is_active !== false;
}
