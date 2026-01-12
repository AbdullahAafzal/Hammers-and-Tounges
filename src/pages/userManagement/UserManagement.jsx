import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUsersList } from "../../store/actions/adminActions";
import "./UserManagement.css";

const ROWS_PER_PAGE = 5;

const UserManagement = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector(
    (state) => state.admin
  );

  console.log(users, "users");


  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("manager");
  const [page, setPage] = useState(1);


  // Fetch users on component mount and when roleFilter changes
  useEffect(() => {
    dispatch(fetchUsersList());
  }, [dispatch, roleFilter]);

  // // Refresh users list after successful action
  // useEffect(() => {
  //   dispatch(fetchUsersList());
  // }, []);


  // Get user status based on role and verification
  const getUserStatus = (user) => {
    if (user.role === 'manager') {
      return user.is_active ? "Active" : "Inactive";
    }
    if (user.is_suspended) return "Suspended";
    if (user.role === 'seller' && user?.seller_details) {
      if (user.seller_details.is_rejected) return "Rejected";
      if (!user.seller_details.verified) return "Pending";
    }
    return "Active";
  };

  // Check if seller has KYC images attached
  const hasKYCImages = (user) => {
    if (user.role !== 'seller' || !user?.seller_details) return false;
    
    const sellerDetails = user.seller_details;
    const kycImageFields = [
      'id_front',
      'id_back',
      'driving_license_front',
      'driving_license_back',
      'passport_front'
    ];
    
    // Check if at least one KYC image field exists and is not null/empty
    return kycImageFields.some(field => {
      const value = sellerDetails[field];
      if (!value) return false;
      // Handle both string and non-string values
      if (typeof value === 'string') {
        return value.trim() !== '';
      }
      return value !== null && value !== undefined;
    });
  };

  // Filter and paginate users
  // const filteredUsers = useMemo(() => {
  //   if (!users?.results) return [];

  //   return users?.results.filter((user) => {
  //     const searchableText = `${user.full_name || ''} ${user.email || ''} ${user.role || ''} ${getUserStatus(user) || ''}`.toLowerCase();
  //     const matchesSearch = searchableText.includes(search.toLowerCase());
  //     const matchesRole = user.role ? roleFilter : user.role === roleFilter && user.is_staff == 'false' ;
  //     return matchesSearch && matchesRole;
  //   });
  // }, [users, search, roleFilter]);

  // console.log('Filtered Data: ', filteredUsers);
  
const filteredUsers = useMemo(() => {
  if (!users?.results) return [];

  return users.results.filter((user) => {
    const searchableText = `
      ${user.full_name || ""}
      ${user.email || ""}
      ${user.role || ""}
      ${getUserStatus(user) || ""}
    `.toLowerCase();

    const matchesSearch = searchableText.includes(search.toLowerCase());

    // ✅ Future-safe is_staff normalization
    const isStaff =
      user?.is_staff === true ||
      user?.is_staff === "true" ||
      user?.is_staff === 1 ||
      false;

    // ✅ Role-based filtering
    const matchesRole =
      roleFilter === "manager"
        ? user.role === "manager" && !isStaff
        : user.role === roleFilter;

    // ✅ Seller filtering: Only show if verified OR (pending with images)
    if (user.role === 'seller' && roleFilter === 'seller') {
      const isVerified = user?.seller_details?.verified === true;
      const isPending = !isVerified;
      
      // If pending, only show if they have KYC images
      if (isPending && !hasKYCImages(user)) {
        return false;
      }
    }

    return matchesSearch && matchesRole;
  });
}, [users, search, roleFilter]);


console.log("filteredUsers: ", filteredUsers);


  const totalPages = Math.ceil(filteredUsers.length / ROWS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  // Get status class
  const getStatusClass = (user) => {
    if (user.role === 'manager') {
      return user.is_active ? "active" : "suspended";
    }
    if (user.is_suspended) return "suspended";
    if (user.role === 'seller' && user?.seller_details) {
      if (user.seller_details.is_rejected) return "rejected";
      if (!user.seller_details.verified) return "pending";
    }
    return "active";
  };

  // Handle user action
  // const handleUserAction = async (userId, actionType, role = null) => {
  //   const actionData = {
  //     type: actionType,
  //     target_id: userId,
  //   };

  //   if (role) {
  //     actionData.role = role;
  //   }

  //   await dispatch(performUserAction(actionData));
  // };

  // Get role display name
  const getRoleDisplayName = (role) => {
    const roleMap = {
      'admin': 'Administrator',
      'seller': 'Seller',
      'buyer': 'Buyer',
      'manager': 'Manager'
    };
    return roleMap[role] || role;
  };

  return (
    <div className="user-management-container">
      {/* Page Header */}
      <header className="user-management-header">
        <div>
          <h1 className="user-management-title">User Management</h1>
          <p className="user-management-subtitle">Manage all users on the Hammer & Tongues platform.</p>
        </div>
        {roleFilter === 'manager' && (
          <button 
            className="user-management-create-btn"
            onClick={() => navigate('/admin/manager/create')}
            disabled={isLoading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Create Manager
          </button>
        )}
      </header>

      {/* Filters Section */}
      <div className="user-management-filters">
        <div className="user-management-search-wrapper">
          <button className='user-management-search-btn'>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <input
            type="text"
            className="user-management-search-input"
            placeholder="Search by name, email, role or status..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            disabled={isLoading}
          />
          {search && (
            <button
              className="user-management-clear-search"
              onClick={() => {
                setSearch('');
                setPage(1);
              }}
              aria-label="Clear search"
              disabled={isLoading}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        <select
          className="user-management-role-filter"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          disabled={isLoading}
        >
          <option value="manager">Manager</option>
          <option value="seller">Seller</option>
          <option value="buyer">Buyer</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="user-management-loading">
          <div className="user-management-loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : (
        /* Users Table */
        <div className="user-management-table-container">
          <table className="user-management-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                {roleFilter === 'seller' && <th>Actions</th>}
                {/* Actions column only shown for sellers */}
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="user-management-table-row" 
                  onClick={
                    roleFilter === 'seller' && user.role === 'seller' 
                      ? () => navigate(`/admin/kycverification/${user.id}`)
                      : roleFilter === 'manager' && user.role === 'manager'
                      ? () => navigate(`/admin/manager/${user.id}`)
                      : undefined
                  }
                  style={
                    (roleFilter === 'seller' && user.role === 'seller') || 
                    (roleFilter === 'manager' && user.role === 'manager')
                      ? { cursor: 'pointer' } 
                      : { cursor: 'default' }
                  }
                >
                  <td className="user-management-name-cell">
                    <div className="user-management-avatar">
                      {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <span>{user.full_name || 'N/A'}</span>
                  </td>
                  <td className="user-management-email-cell">
                    {user.email || 'N/A'}
                  </td>
                  <td className="user-management-role-cell">
                    {getRoleDisplayName(user.role) || 'N/A'}
                  </td>
                  <td className="user-management-status-cell">
                    <span className={`user-management-status user-management-status-${getStatusClass(user)}`}>
                      {getUserStatus(user)}
                    </span>
                  </td>
                  {roleFilter === 'seller' && user.role === 'seller' && (
                    <td className="user-management-actions-cell">
                      <div className="user-management-actions-dropdown">
                        <button className="user-management-actions-trigger">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="6" r="1.5" fill="currentColor" />
                            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                            <circle cx="12" cy="18" r="1.5" fill="currentColor" />
                          </svg>
                        </button>
                        {/* <div className="user-management-actions-menu">
                          {user.role === 'seller' && !user.is_verified && (
                            <button
                              className="user-management-action-btn user-management-action-verify"
                              onClick={() => handleUserAction(user.id, 'VERIFY_SELLER')}
                              disabled={isPerformingAction}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Verify Seller
                            </button>
                          )}
                          {user.role === 'seller' && (
                            <button
                              className="user-management-action-btn user-management-action-promote"
                              onClick={() => handleUserAction(user.id, 'PROMOTE_TO_MANAGER')}
                              disabled={isPerformingAction}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Promote to Manager
                            </button>
                          )}
                          {user.role === 'manager' && (
                            <button
                              className="user-management-action-btn user-management-action-suspend"
                              onClick={() => handleUserAction(user.id, 'SUSPEND_MANAGER')}
                              disabled={isPerformingAction}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                              Suspend Manager
                            </button>
                          )}
                          <button
                            className="user-management-action-btn user-management-action-change"
                            onClick={() => handleUserAction(user.id, 'SPECIFIC_ROLE_ACTION', 'buyer')}
                            disabled={isPerformingAction}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Change to Buyer
                          </button>
                        </div> */}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredUsers.length === 0 ? (
            <div className="user-management-empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3>No users found</h3>
              <p>Try adjusting your filters or search term</p>
            </div>
          ) : (
            /* Pagination */
            <div className="user-management-pagination">
              <div className="user-management-pagination-info">
                Showing {((page - 1) * ROWS_PER_PAGE) + 1} to {Math.min(page * ROWS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
              </div>

              <div className="user-management-pagination-controls">
                <button
                  className="user-management-pagination-btn user-management-pagination-prev"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1 || isLoading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>

                <div className="user-management-page-numbers">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`user-management-page-number ${page === i + 1 ? "user-management-page-active" : ""}`}
                      onClick={() => setPage(i + 1)}
                      disabled={isLoading}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  className="user-management-pagination-btn user-management-pagination-next"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === totalPages || isLoading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserManagement;