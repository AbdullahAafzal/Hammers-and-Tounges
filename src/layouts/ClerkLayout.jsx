import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ClerkSideDrawer from "../components/ClerkSideDrawer";
import "./ManagerLayout.css";

const ClerkLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <div className={`manager-layout ${drawerOpen ? "drawer-open" : ""}`}>
      {!drawerOpen && (
        <button
          className="manager-layout__toggle"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <main className="manager-layout__main">
        <Outlet />
      </main>

      <ClerkSideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
};

export default ClerkLayout;

