import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import type { UserRole } from "../types";

export default function NavbarComponent() {
  const [userRole, setUserRole] = useState<UserRole>(
    () => (localStorage.getItem("userRole") as UserRole) || ""
  );
  const location = useLocation();

  useEffect(() => {
    const updateRole = () => {
      setUserRole((localStorage.getItem("userRole") as UserRole) || "");
    };

    window.addEventListener("storage", updateRole);
    return () => window.removeEventListener("storage", updateRole);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-gray-900 hover:text-gray-700"
            >
              EcommStore
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/")
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Products
            </Link>

            {userRole !== "accountant" && (
              <Link
                to="/order2"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/order2")
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Cart
              </Link>
            )}

            {userRole === "accountant" && (
              <>
                <Link
                  to="/admin/products"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/admin/products")
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Manage Products
                </Link>
                <Link
                  to="/admin/orders"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/admin/orders")
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Orders
                </Link>
                <Link
                  to="/admin/customers"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/admin/customers")
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Customers
                </Link>
              </>
            )}

            {userRole === "customer" && (
              <Link
                to="/customer"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/customer")
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                My Orders
              </Link>
            )}

            {!userRole ? (
              <Link
                to="/auth"
                className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                {userRole === "customer" &&
                  localStorage.getItem("customerId") && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      ID: {localStorage.getItem("customerId")}
                    </span>
                  )}
                <button
                  onClick={() => {
                    localStorage.removeItem("userRole");
                    localStorage.removeItem("customerId");
                    localStorage.removeItem("customerName");
                    setUserRole("");
                    window.dispatchEvent(new Event("storage"));
                  }}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout ({userRole})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
