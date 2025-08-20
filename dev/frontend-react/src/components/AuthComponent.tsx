import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "../types";

export default function AuthComponent() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("");
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    localStorage.setItem("userRole", role);
    // Trigger storage event for navbar update
    window.dispatchEvent(new Event("storage"));

    // Navigate to appropriate page based on role
    if (role === "customer") {
      navigate("/");
    } else if (role === "accountant") {
      navigate("/order");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    setSelectedRole("");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Authentication
        </h2>

        {!selectedRole ? (
          <div className="space-y-4">
            <p className="text-gray-600 text-center mb-4">
              Select your role to continue:
            </p>
            <button
              onClick={() => handleRoleSelect("customer")}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Login as Customer
            </button>
            <button
              onClick={() => handleRoleSelect("accountant")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Login as Accountant
            </button>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-2">
                Debug: Quick Customer Login
              </p>
              <button
                onClick={() => {
                  // Set a debug customer ID for testing
                  localStorage.setItem("customerId", "1");
                  localStorage.setItem("customerName", "Debug Customer");
                  handleRoleSelect("customer");
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
              >
                🛠️ Debug Login (Customer ID: 1)
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Logged in as:{" "}
              <span className="font-semibold text-emerald-600">
                {selectedRole}
              </span>
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
