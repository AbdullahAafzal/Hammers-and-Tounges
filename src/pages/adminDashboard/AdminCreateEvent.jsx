import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/interceptors/admin.service';
import { auctionService } from '../../services/interceptors/auction.service';
import { toast } from 'react-toastify';
import '../ManagerCreateEvent.css';

export default function AdminCreateEvent() {
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    manager: '',
    start_time: '',
    end_time: '',
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingManagers(true);
      try {
        const res = await adminService.getUsersList({ role: 'manager', page_size: 200 });
        const rawList = res?.results || [];
        const list = rawList.filter((u) => (u.role || '').toLowerCase() === 'manager');
        if (!cancelled) setManagers(list.length ? list : rawList);
      } catch (err) {
        if (!cancelled) {
          toast.error(err?.message || 'Failed to load managers');
        }
      } finally {
        if (!cancelled) setLoadingManagers(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!formData.title?.trim()) {
        toast.error('Please enter an event name.');
        return;
      }
      if (!formData.manager) {
        toast.error('Please select a manager for this event.');
        return;
      }
      if (!formData.start_time || !formData.end_time) {
        toast.error('Please set start and end date/time.');
        return;
      }
      setIsSubmitting(true);
      try {
        const managerId = formData.manager;
        const payload = {
          title: formData.title.trim(),
          manager: Number(managerId),
          start_time: new Date(formData.start_time).toISOString(),
          end_time: new Date(formData.end_time).toISOString(),
          status: 'SCHEDULED',
        };
        await auctionService.createEvent(payload);
        toast.success('Event created successfully!');
        navigate('/admin/dashboard');
      } catch (err) {
        const msg = err?.response?.data?.message || err?.response?.data?.detail || err?.message;
        toast.error(msg || 'Failed to create event. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, navigate]
  );

  const handleCancel = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="create-event-page">
      <header className="create-event-header">
        <div>
          <h1 className="create-event-title">Create Event</h1>
          <p className="create-event-subtitle">
            Add a new auction event. All fields marked with * are required.
          </p>
        </div>
      </header>

      <div className="create-event-content">
        <div className="create-event-card">
          <form onSubmit={handleSubmit} className="create-event-form">
            <div className="create-event-form-group">
              <label>Event Name <span className="required">*</span></label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                disabled={isSubmitting}
                placeholder="e.g. Mega Auto Auction"
              />
            </div>

            <div className="create-event-form-group">
              <label>Manager <span className="required">*</span></label>
              <select
                name="manager"
                value={formData.manager}
                onChange={handleFormChange}
                disabled={isSubmitting || loadingManagers}
                required
                className="create-event-select"
              >
                <option value="">Select a manager</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.email || m.display_name || `${m.first_name || ''} ${m.last_name || ''}`.trim() || `Manager #${m.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="create-event-form-row">
              <div className="create-event-form-group">
                <label>Start Date & Time <span className="required">*</span></label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleFormChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="create-event-form-group">
                <label>End Date & Time <span className="required">*</span></label>
                <input
                  type="datetime-local"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleFormChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="create-event-form-actions">
              <button
                type="submit"
                className="create-event-btn-primary"
                disabled={isSubmitting || loadingManagers}
              >
                {isSubmitting ? (
                  <>
                    <span className="create-event-spinner" />
                    Creating...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Create Event
                  </>
                )}
              </button>
              <button
                type="button"
                className="create-event-btn-secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
