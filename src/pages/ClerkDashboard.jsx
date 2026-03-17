import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auctionService } from "../services/interceptors/auction.service";
import { toast } from "react-toastify";
import EventListingRow from "../components/EventListingRow";
import "./ManagerDashboard.css";

const TAB_UPCOMING = "upcoming";
const TAB_PAST = "past";
const ITEMS_PER_PAGE = 15;

export default function ClerkDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState(null);
  const [activeTab, setActiveTab] = useState(TAB_UPCOMING);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setEventsLoading(true);
      setEventsError(null);
      try {
        const res = await auctionService.getEvents({ page: 1 });
        const list = res?.results ?? (Array.isArray(res) ? res : []);
        if (!cancelled) setEvents(list);
      } catch (err) {
        if (!cancelled) {
          setEvents([]);
          setEventsError(err);
          toast.error("Failed to load events");
        }
      } finally {
        if (!cancelled) setEventsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    if (!events?.length) return [];
    const now = new Date();
    if (activeTab === TAB_UPCOMING) {
      return events.filter((e) => {
        const end = e.end_time ? new Date(e.end_time) : null;
        const status = (e.status || "").toUpperCase();
        if (status === "CLOSED" || status === "CLOSING") return false;
        return !end || end > now;
      });
    }
    return events.filter((e) => {
      const end = e.end_time ? new Date(e.end_time) : null;
      const status = (e.status || "").toUpperCase();
      if (status === "CLOSED" || status === "CLOSING") return true;
      return end && end <= now;
    });
  }, [events, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / ITEMS_PER_PAGE));
  const paginatedEvents = filteredEvents.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => setPage(1), [activeTab]);

  const handleEventClick = useCallback(
    (event) => {
      navigate(`/clerk/event/${event.id}`, { state: { event } });
    },
    [navigate]
  );

  return (
    <div className="manager-dashboard-container" role="main">
      <header className="manager-dashboard-header">
        <div className="manager-dashboard-header-content">
          <h1 className="manager-dashboard-title">Clerk Dashboard</h1>
          <p className="manager-dashboard-subtitle">View events and lots</p>
        </div>
      </header>

      <div className="manager-dashboard-main">
        <section className="manager-dashboard-card" aria-label="Events">
          <div className="manager-dashboard-card-header">
            <div className="manager-dashboard-card-title-wrapper">
              <h2 className="manager-dashboard-card-title">Events</h2>
              <span className="manager-dashboard-event-count">({filteredEvents.length})</span>
            </div>
            <div className="buyer-dashboard-tabs">
              <button
                type="button"
                className={`buyer-dashboard-tab ${activeTab === TAB_UPCOMING ? "active" : ""}`}
                onClick={() => setActiveTab(TAB_UPCOMING)}
              >
                Upcoming
              </button>
              <button
                type="button"
                className={`buyer-dashboard-tab ${activeTab === TAB_PAST ? "active" : ""}`}
                onClick={() => setActiveTab(TAB_PAST)}
              >
                Past
              </button>
            </div>
          </div>

          {eventsLoading && !events.length ? (
            <div className="manager-dashboard-loading">Loading events...</div>
          ) : eventsError && !events.length ? (
            <div className="manager-dashboard-empty">Failed to load events</div>
          ) : paginatedEvents.length === 0 ? (
            <div className="manager-dashboard-empty">No events found</div>
          ) : (
            <>
              <div className="manager-dashboard-events-list">
                {paginatedEvents.map((event) => (
                  <EventListingRow key={event.id} event={event} onClick={handleEventClick} />
                ))}
              </div>
              {filteredEvents.length > ITEMS_PER_PAGE && (
                <div className="buyer-dashboard-pagination">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                    Previous
                  </button>
                  <span className="buyer-dashboard-pagination-info">
                    Page {page} of {totalPages}
                  </span>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

