/** @typedef {{ id: string, name: string, items: { id: string, name: string }[] }} ChecklistSection */

/**
 * Convert API template_data to UI sections.
 * @param {Record<string, (string|{name?: string})[]>|null|undefined} templateData
 * @returns {ChecklistSection[]}
 */
export const templateDataToSections = (templateData) => {
  if (!templateData || typeof templateData !== 'object') return [];

  return Object.entries(templateData).map(([name, items], index) => ({
    id: `section-${index}`,
    name,
    items: Array.isArray(items)
      ? items.map((item, itemIndex) => ({
          id: `item-${index}-${itemIndex}`,
          name: typeof item === 'string' ? item : item?.name || String(item),
        }))
      : [],
  }));
};

/**
 * Build checklist_data payload from sections + values map.
 * @param {ChecklistSection[]} sections
 * @param {Record<string, string>} values keyed by `${sectionName}::${itemName}`
 */
export const buildChecklistData = (sections, values) => {
  const data = {};
  sections.forEach((section) => {
    const sectionData = {};
    section.items.forEach((item) => {
      const key = `${section.name}::${item.name}`;
      if (values[key]) {
        sectionData[item.name] = values[key];
      }
    });
    if (Object.keys(sectionData).length > 0) {
      data[section.name] = sectionData;
    }
  });
  return data;
};

/**
 * Flatten nested checklist_data into values map.
 * @param {Record<string, Record<string, string>>|Record<string, string>|null|undefined} checklistData
 */
export const flattenChecklistData = (checklistData) => {
  const values = {};
  if (!checklistData || typeof checklistData !== 'object') return values;

  Object.entries(checklistData).forEach(([section, items]) => {
    if (items && typeof items === 'object' && !Array.isArray(items)) {
      Object.entries(items).forEach(([itemName, val]) => {
        values[`${section}::${itemName}`] = String(val);
      });
    } else {
      values[section] = String(items);
    }
  });
  return values;
};

/** All template items have a non-empty value */
export const isChecklistFilled = (sections, values) => {
  if (!sections.length) return false;
  return sections.every((section) =>
    section.items.every((item) => {
      const key = `${section.name}::${item.name}`;
      return Boolean(values[key]?.trim());
    })
  );
};

export const GRV_TAB_LABEL = 'Checklist & Goods Receive Verification';

/** Normalize lot.category / category_id (number or nested object) for API calls. */
export const resolveLotCategoryId = (lot) => {
  const raw = lot?.category_id ?? lot?.category;
  if (raw == null || raw === '') return null;
  if (typeof raw === 'object') {
    const id = raw.id ?? raw.pk;
    return id != null ? Number(id) : null;
  }
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

/** Active checklist template from category detail API (`checklist_template` may be null). */
export const checklistTemplateFromCategoryDetail = (detail) => {
  const template = detail?.checklist_template;
  if (!template || template.is_active === false) return null;
  return template;
};
