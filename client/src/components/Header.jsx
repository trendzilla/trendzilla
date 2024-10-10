import { useState, useRef, useEffect } from "react";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Header = ({ cartItems }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const hideTooltipTimeout = useRef(null);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    setIsTooltipOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDashboardClick = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/isAdmin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.isAdmin) {
        navigate("/admin");
      } else {
        toast.error("You are not an admin");
      }
    } catch (err) {
      toast.error("You are not an admin");
    }
  };

  const hideFullHeader =
    location.pathname === "/login" || location.pathname === "/register";

  const showTooltip = () => {
    if (hideTooltipTimeout.current) {
      clearTimeout(hideTooltipTimeout.current);
    }
    setIsTooltipOpen(true);
  };

  const hideTooltip = () => {
    hideTooltipTimeout.current = setTimeout(() => {
      setIsTooltipOpen(false);
    }, 300);
  };

  const handleOrdersClick = () => {
    navigate("/orders");
  };

 
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <header className="fixed top-0 w-full bg-gray-900 text-white z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link
            to="/"
            onClick={scrollToTop}
            className="hover:opacity-80 transition-opacity"
          >
            TrendZilla
          </Link>
        </div>

        {/* Only show the full header (cart, nav, etc.) on non-login/register pages */}
        {!hideFullHeader && (
          <>
            <nav className="space-x-6">
              <Link to="/" className="hover:text-gray-400 transition-colors">
                Home
              </Link>
              <Link
                to="/shop"
                className="hover:text-gray-400 transition-colors"
              >
                Shop
              </Link>
            </nav>

            <div className="flex items-center">
              <Link to="/cart" className="flex items-center">
                <FiShoppingCart size={24} className="mr-2" />
                <span className="text-sm bg-red-500 text-white px-2 py-1 rounded-full">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </Link>

              <div
                className="relative ml-4"
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
              >
                <FiUser
                  size={24}
                  className="cursor-pointer hover:text-gray-400 transition-colors"
                />

                {isTooltipOpen && (
                  <div
                    className="absolute right-0 mt-2 bg-white text-black p-4 rounded shadow-lg"
                    onMouseEnter={showTooltip}
                    onMouseLeave={hideTooltip}
                  >
                    {isLoggedIn ? (
                      <>
                        <button
                          onClick={handleDashboardClick}
                          className="block mb-2 hover:text-blue-500"
                        >
                          Dashboard
                        </button>
                        <Link
                          to="/orders"
                          className="block mb-2 hover:text-blue-500"
                        >
                          Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left hover:text-red-500"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link to="/login" className="block hover:text-blue-500">
                        Login
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
