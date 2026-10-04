import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-[#006194] animate-spin">
            progress_activity
          </span>
          <p className="text-sm font-semibold text-[#3f4850]">Verifying secure access...</p>
        </div>
      </div>
    );
  }

  // Not logged in or guest trying to access restricted admin/staff routes
  if (!user || user.isGuest) {
    const requiredRole = allowedRoles.includes("admin") ? "admin" : allowedRoles.includes("staff") ? "staff" : "customer";
    return <Navigate to={`/login?role=${requiredRole}&redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check if current user role matches allowed roles
  const hasAccess = allowedRoles.length === 0 || allowedRoles.includes(user.role);

  if (!hasAccess) {
    // If staff tries to access admin-only, or customer tries to access admin/staff
    const requiredRole = allowedRoles[0] || "admin";
    return <Navigate to={`/login?role=${requiredRole}&redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}
