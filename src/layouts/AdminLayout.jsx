import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AdminSideDrawer from '../components/AdminSideDrawer'
import { clearPermissions, setPermissionsForUser } from '../store/slices/permissionsSlice'
import { FINANCE_READ_ONLY_FEATURES, isFinanceUser } from '../utils/financeAccess'
import './AdminLayout.css'

const AdminLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(true)
  const dispatch = useDispatch()
  const authUser = useSelector((state) => state.auth?.user)
  const authUserId = authUser?.id

  useEffect(() => {
    if (!authUserId) return
    if (isFinanceUser(authUser)) {
      dispatch(
        setPermissionsForUser({
          userId: authUserId,
          features: FINANCE_READ_ONLY_FEATURES,
        })
      )
      return
    }
    dispatch(clearPermissions())
  }, [dispatch, authUser, authUserId])

  return (
    <div className={`admin-layout ${drawerOpen ? 'drawer-open' : ''}`}>
      {!drawerOpen && (
        <button
          className="admin-layout__toggle"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <main className="admin-layout__main">
        <Outlet />
      </main>

      <AdminSideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}

export default AdminLayout
