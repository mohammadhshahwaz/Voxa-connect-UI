import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Loader from "../loader/loader";

const Layout = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);

    // Simulate component loading (replace with real API/image load later)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar stays visible */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 bg-[var(--color-bg-light)] overflow-auto flex items-center justify-center">
        {loading ? (
          // Loader only in right section
          <Loader />
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default Layout;
