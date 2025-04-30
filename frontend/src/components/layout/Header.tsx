import React, { useEffect, useState, useRef } from "react";
import Container from "../ui/Container";
import { cn } from "@/lib/utils";
import { Menu, X, User, LogOut, UserCircle, Settings, Calendar, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@/lib/api";

interface NavItem {
  label: string;
  href: string;
}

interface UserData {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Rooms", href: "/rooms" },
  { label: "Gallery", href: "/gallery" },
  { label: "Help Center", href: "/help-center" },
];

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
        if (token) {
          const user = await authApi.getUser();
          setIsAuthenticated(true);
          setUserData(user);
        } else {
          setIsAuthenticated(false);
          setUserData(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUserData(null);
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsAuthenticated(false);
      setUserData(null);
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <Container className="flex items-center justify-between">
        <Link to="/" className="relative z-10">
          <h1 className="text-2xl font-bold text-elkaavie-800">
            Elkaavie<span className="text-elkaavie-500">.</span>
          </h1>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden z-10 p-2 text-gray-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Navigation */}
        <nav
          className={cn(
            "fixed top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center space-y-6 text-lg font-medium transition-transform duration-300 md:hidden",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-gray-800 hover:text-elkaavie-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center text-gray-800 hover:text-elkaavie-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-5 w-5 mr-2" />
                My Profile
              </Link>
              <Link
                to="/profile"
                className="flex items-center text-gray-800 hover:text-elkaavie-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Calendar className="h-5 w-5 mr-2" />
                My Bookings
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center text-gray-800 hover:text-elkaavie-600"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2.5 bg-elkaavie-600 text-white font-medium rounded-lg hover:bg-elkaavie-700 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </nav>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "text-sm font-medium transition-colors duration-200 relative",
                isScrolled ? "text-gray-700 hover:text-elkaavie-700" : "text-gray-800 hover:text-elkaavie-600",
                "after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-elkaavie-500 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
              )}
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-elkaavie-600 text-white flex items-center justify-center text-sm font-medium">
                  {userData && userData.name ? getInitials(userData.name) : 'U'}
                </div>
                <span className={`text-sm font-medium ${isScrolled ? "text-gray-700" : "text-gray-800"}`}>
                  {userData && userData.name ? userData.name.split(' ')[0] : 'User'}
                </span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userData?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{userData?.email || ''}</p>
                  </div>
                  <Link 
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <UserCircle size={16} />
                    My Profile
                  </Link>
                  <Link 
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <Calendar size={16} />
                    My Bookings
                  </Link>
                  <Link 
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <Settings size={16} />
                    Account Settings
                  </Link>
                  <div className="border-t border-gray-100 mt-1">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 bg-elkaavie-600 text-white text-sm font-medium rounded-lg hover:bg-elkaavie-700 transition"
            >
              Login
            </Link>
          )}
        </nav>
      </Container>
    </header>
  );
};

export default Header;
