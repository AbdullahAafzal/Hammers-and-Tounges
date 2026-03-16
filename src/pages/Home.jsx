import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchEvents } from '../store/actions/AuctionsActions'
import Hero from '../components/Hero'
import EventListingRow from '../components/EventListingRow'
import './Home.css'

const TAB_UPCOMING = 'upcoming'
const TAB_PAST = 'past'

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { token } = useSelector(state => state.auth)
  const { events, eventsLoading, eventsError } = useSelector(state => state.buyer)

  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState(TAB_UPCOMING)
  const [allEvents, setAllEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const filteredEvents = useMemo(() => {
    if (!allEvents.length) return []
    const now = new Date()
    if (activeTab === TAB_UPCOMING) {
      return allEvents.filter((e) => {
        const end = e.end_time ? new Date(e.end_time) : null
        const status = (e.status || '').toUpperCase()
        if (status === 'CLOSED' || status === 'CLOSING') return false
        return !end || end > now
      })
    }
    return allEvents.filter((e) => {
      const end = e.end_time ? new Date(e.end_time) : null
      const status = (e.status || '').toUpperCase()
      if (status === 'CLOSED' || status === 'CLOSING') return true
      return end && end <= now
    })
  }, [allEvents, activeTab])

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true)
      try {
        let results = []
        let nextPage = 1
        let hasMore = true
        while (hasMore) {
          const res = await dispatch(fetchEvents({ page: nextPage })).unwrap()
          results = [...results, ...(res.results || [])]
          hasMore = !!res.next
          nextPage += 1
        }
        setAllEvents(results)
      } catch (err) {
        setAllEvents([])
      } finally {
        setIsLoading(false)
      }
    }
    loadEvents()
  }, [dispatch])

  const itemsPerPage = 12
  const totalPages = Math.ceil((filteredEvents.length || 0) / itemsPerPage)
  const paginatedEvents = (filteredEvents || []).slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  useEffect(() => {
    setPage(1)
  }, [activeTab])

  const handleEventClick = (event) => {
    if (token) {
      navigate(`/buyer/event/${event.id}`, { state: { event } })
    } else {
      navigate(`/event/${event.id}`, { state: { event } })
    }
  }

  return (
    <div className="home-page">
      <Hero />

      <section className="home-events">
        <div className="home-events__container">
          <div className="home-events__tabs-wrap">
            <div className="home-events__tabs">
              <button
                className={`home-events__tab ${activeTab === TAB_UPCOMING ? 'active' : ''}`}
                onClick={() => setActiveTab(TAB_UPCOMING)}
              >
                Upcoming
              </button>
              <button
                className={`home-events__tab ${activeTab === TAB_PAST ? 'active' : ''}`}
                onClick={() => setActiveTab(TAB_PAST)}
              >
                Past
              </button>
            </div>
            <span className="home-events__count">
              {isLoading && allEvents.length === 0 ? '...' : `${filteredEvents.length} events`}
            </span>
          </div>

          {isLoading && allEvents.length === 0 && (
            <div className="home-loading">
              <div className="home-spinner" />
              <p>Loading events...</p>
            </div>
          )}

          {eventsError && !isLoading && allEvents.length === 0 && (
            <div className="home-error">
              <p>Failed to load events</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}

          {!isLoading && !eventsError && paginatedEvents.length === 0 && (
            <div className="home-empty">
              <p>{activeTab === TAB_UPCOMING ? 'No upcoming events.' : 'No past events.'}</p>
            </div>
          )}

          {!isLoading && !eventsError && paginatedEvents.length > 0 && (
            <>
              <div className="home-events-list">
                {paginatedEvents.map((event) => (
                  <EventListingRow
                    key={event.id}
                    event={event}
                    onClick={handleEventClick}
                  />
                ))}
              </div>

              {filteredEvents.length > itemsPerPage && (
                <div className="home-pagination">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="home-pagination__btn"
                  >
                    Previous
                  </button>
                  <span className="home-pagination__info">{page} of {totalPages}</span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="home-pagination__btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
