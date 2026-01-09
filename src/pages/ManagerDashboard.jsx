import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { managerService } from '../services/interceptors/manager.service';
import "./ManagerDashboard.css";

// Map API status to display status
const mapStatusToDisplay = (apiStatus) => {
  const statusMap = {
    'DRAFT': 'DRAFT',
    'ACTIVE': 'Pending Inspection',
    'PENDING': 'Pending Inspection',
    'IN_PROGRESS': 'In Progress',
    'REJECTED': 'Rejected',
    'COMPLETED': 'Completed',
    'APPROVED': 'Completed'
  };
  return statusMap[apiStatus] || apiStatus || 'Pending Inspection';
};

function ManagerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchTasksRef = useRef(null);

  const handleAction = (status, item) => {
    // Check raw status for DRAFT, or display status for others
    const rawStatus = item.rawData?.status || '';
    const isDraft = rawStatus === 'DRAFT';
    
    if (isDraft || status === "Pending Inspection" || status === "In Progress") {
      navigate("/manager/inspection",
        {
          state: {
            startInspection: true,
            auctionData: item.rawData
          }
        });
    } else if (status === "Rejected") {
      navigate("/manager/inspection", { 
        state: { 
          startInspection: false,
          auctionData: item.rawData
        } 
      });
    }
  };

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const itemsPerPage = 5;

  // Fetch tasks function
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await managerService.getAssignedTasks();
      // Transform API response to dashboard format
      const transformedData = Array.isArray(response) ? response.map((item) => {
        // Get manager name from manager_details
        const managerName = item.manager_details 
          ? `${item.manager_details.first_name || ''} ${item.manager_details.last_name || ''}`.trim() || item.manager_details.email || 'Unassigned'
          : 'Unassigned';
        
        return {
          id: `INSP-${item.id}`,
          originalId: item.id,
          category: item.category_name || 'Unknown',
          seller: item.seller_details?.name || 'Unknown Seller',
          status: mapStatusToDisplay(item.status),
          officer: managerName,
          date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          title: item.title,
          description: item.description,
          rejection_reason: item.rejection_reason,
          rawData: item // Keep original data for reference
        };
      }) : [];
      setTasks(transformedData);
    } catch (err) {
      console.error('Error fetching manager tasks:', err);
      setError(err.message || 'Failed to load tasks. Please try again.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Store fetchTasks in ref for use in other effects
  fetchTasksRef.current = fetchTasks;
  const prevPathnameRef = useRef(location.pathname);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
    prevPathnameRef.current = location.pathname;
  }, []);

  // Refetch tasks when navigating back to dashboard from another route
  useEffect(() => {
    const prevPathname = prevPathnameRef.current;
    const currentPathname = location.pathname;
    
    // Only refetch if we navigated TO the dashboard (not if we're already on it)
    if (currentPathname === '/manager/dashboard' && prevPathname !== currentPathname) {
      // Small delay to ensure navigation is complete
      const timeoutId = setTimeout(() => {
        if (fetchTasksRef.current) {
          fetchTasksRef.current();
        }
      }, 300);
      
      prevPathnameRef.current = currentPathname;
      return () => clearTimeout(timeoutId);
    } else {
      prevPathnameRef.current = currentPathname;
    }
  }, [location.pathname]);

  // Also refetch when window regains focus (user switches back to tab)
  useEffect(() => {
    const handleFocus = () => {
      if (location.pathname === '/manager/dashboard' && fetchTasksRef.current) {
        // Only refetch if it's been a while since last fetch (avoid excessive calls)
        fetchTasksRef.current();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [location.pathname]);

  const sortedData = useMemo(() => {
    // Filter to show only PENDING status items
    const pendingItems = tasks.filter(item => {
      const rawStatus = item.rawData?.status || '';
      return rawStatus === 'PENDING';
    });
    return [...pendingItems].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [tasks]);

  const filtered = useMemo(() => {
    return sortedData.filter(item => {
      const matchSearch =
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.seller.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "All" || item.category === category;
      const matchStatus = status === "All" || item.status === status;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [search, category, status, sortedData]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function generatePageNumbers() {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  }

  const ActionButton = ({ status, item }) => {
    // Check raw status for DRAFT, or display status for others
    const rawStatus = item.rawData?.status || '';
    const isDraft = rawStatus === 'DRAFT';
    
    if (isDraft || status === "Pending Inspection" || status === "In Progress")
      return <button className="manager-view-btn" onClick={() => handleAction(status, item)}>Start Inspection</button>;

    if (status === "Rejected")
      return <button className="manager-view-btn view-danger-btn" onClick={() => handleAction(status, item)}>View Report</button>;

    return <span className="text-gray-500">—</span>;
  }

  const applyFilters = () => setCurrentPage(1);

  const getCategoryIcon = (category) => {
    const icons = {
      'Vehicle': '🚗',
      'Electronics': '💻',
      'Furniture': '🪑',
      'Artwork': '🎨',
      'Home Goods': '🏠'
    };
    return icons[category] || '📦';
  };

  return (
    <>
      <div className="manager-wrapper">
        <div className="manager-container">

          <div className="manager-section-header">
            <div className="manager-header-content">
              <h1 className="manager-page-title">Inspection Queue</h1>
              <p className="manager-page-subtitle">Manage and track all items pending inspections</p>
            </div>
          </div>

          <div className="manager-filter-section">
            <div className="manager-search-container">
              <div className="manager-search-input-wrapper">
                <button className='manager-search-btn'>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                <input
                  type="text"
                  placeholder="Search by Item ID or Seller..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="manager-search-input"
                />
                {search && (
                  <button
                    className="manager-clear-search"
                    onClick={() => setSearch('')}
                    aria-label="Clear search"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* <select className="manager-filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {Array.from(new Set(tasks.map(item => item.category))).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select> */}

            <select className="manager-filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Pending Inspection">Pending Inspection</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {/* <button onClick={applyFilters} className="manager-apply-btn">Apply</button>

            <button onClick={() => { setSearch(''); setCategory("All"); setStatus("All"); applyFilters(); }} className="manager-clear-btn">
              Clear
            </button> */}
          </div>

          <div className="manager-data-table-section">
            <div className="manager-table-wrapper">
              <table className="manager-data-table">
                <thead>
                  <tr className='manager-row-headings'>
                    <th>Item ID</th>
                    <th>Item Category</th>
                    <th>Seller</th>
                    <th>Status</th>
                    <th>Assigned Manager</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6">
                        <div className="manager-empty-state">
                          <div className="manager-empty-icon manager-loading-spinner">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="16" opacity="0.3"/>
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="16" className="spinner-circle"/>
                            </svg>
                          </div>
                          <h3>Loading tasks...</h3>
                          <p>Please wait while we fetch your assigned inspections</p>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="6">
                        <div className="manager-empty-state">
                          <div className="manager-empty-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </div>
                          <h3>Error loading tasks</h3>
                          <p>{error}</p>
                          <button 
                            onClick={() => window.location.reload()} 
                            className="manager-apply-btn"
                            style={{ marginTop: '1rem' }}
                          >
                            Retry
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`manager-table-row ${selectedRow === item.id ? "row-selected" : ""}`}
                        onClick={() => {
                          setSelectedRow(item.id)
                        }
                        }

                      >
                        <td>
                          <span className="manager-item-id">{item.id}</span>
                        </td>

                        <td>
                          <div className="manager-category-info">
                            <div className="manager-category-icon-cell">
                              <span className="manager-category-icon-emoji">{getCategoryIcon(item.category)}</span>
                            </div>
                            <span className="manager-category-name">{item.category}</span>
                          </div>
                        </td>

                        <td>
                          <span className="manager-seller-name">{item.seller}</span>
                        </td>

                        <td>
                          <div className="manager-status-cell">
                            <span className={`manager-status-badge ${item.status === "Pending Inspection" ? "badge-pending" :
                              item.status === "Rejected" ? "badge-inprogress" : ""
                              }`}>
                              {item.status}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className="manager-officer-name">{item.officer}</span>
                        </td>

                        <td>
                          <div className="manager-action-buttons">
                            <ActionButton status={item.status} item={item} />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">
                        <div className="manager-empty-state">
                          <div className="manager-empty-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <h3>No records found</h3>
                          <p>Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {filtered.length > itemsPerPage && (
              <div className="manager-pagination">
                <button
                  className="manager-pagination-btn manager-prev-btn"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Previous
                </button>

                <div className="manager-page-numbers">
                  {generatePageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`dots-${index}`} className="manager-page-dots">...</span>
                    ) : (
                      <button
                        key={page}
                        className={`manager-page-number ${currentPage === page ? 'active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                <button
                  className="manager-pagination-btn manager-next-btn"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

export default ManagerDashboard;