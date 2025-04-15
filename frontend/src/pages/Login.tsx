import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { authApi } from "@/lib/api";
import { AxiosError } from "axios";
import { Clock, User, CreditCard, Key, Eye, EyeOff, AlertCircle } from "lucide-react";

interface PendingBooking {
  roomId: number;
  roomNumber: string;
  roomType?: string;
  price?: number;
  floor?: number;
}

// Simple error toast component
const ErrorToast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <div className="fixed top-20 left-0 right-0 flex justify-center items-center z-50 px-4">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg flex items-start max-w-md">
        <AlertCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-grow">
          <p className="font-bold">Login Failed</p>
          <p className="text-sm">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="text-red-500 hover:text-red-700"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Error handling
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  
  // Get redirect info from URL search params
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/';
  
  // Check for pending booking
  const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null);
  React.useEffect(() => {
    const pendingBookingData = sessionStorage.getItem('pendingBooking');
    if (pendingBookingData) {
      try {
        setPendingBooking(JSON.parse(pendingBookingData));
      } catch (e) {
        console.error("Error parsing pending booking data", e);
      }
    }
  }, []);

  // Handle login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't proceed if already loading
    if (loading) return;
    
    // Basic validation
    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }
    
    setLoading(true);
    try {
      // Attempt login
      const response = await authApi.login(email, password);
      
      // Try to associate any pending bookings with the user
      try {
        await authApi.associateBookings(email, response.user.phone_number);
      } catch (err) {
        console.error("Failed to associate bookings:", err);
      }

      // Navigate based on redirect or pending booking
      const pendingBooking = sessionStorage.getItem('pendingBooking');
      if (pendingBooking) {
        navigate('/room-booking');
      } else {
        navigate('/');
      }
    } catch (err) {
      // Handle error
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || "Failed to login. Please try again.";
      
      // Update error message
      let displayError = errorMessage;
      if (errorMessage === 'Invalid login credentials') {
        displayError = 'Incorrect email or password. Please check your credentials and try again.';
      }
      
      if (errorMessage.includes("verify your email")) {
        setShowResendVerification(true);
      }
      
      setErrorMessage(displayError);
    } finally {
      setLoading(false);
    }
  };

  // Handle resend verification email
  const handleResendVerification = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      await authApi.resendVerificationEmailForUser(email, password);
      setResendSuccess(true);
      setShowResendVerification(false);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to resend verification email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      
      {errorMessage && (
        <ErrorToast 
          message={errorMessage} 
          onClose={() => setErrorMessage(null)} 
        />
      )}
      
      <main className="pt-24 pb-16">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your account to continue</p>
              
              {/* Pending Booking Notification */}
              {(redirectPath.includes('room-booking') || pendingBooking) && (
                <div className="mt-4 rounded-xl shadow-sm border border-elkaavie-100 overflow-hidden">
                  <div className="bg-elkaavie-50 p-4">
                    <h3 className="font-medium text-elkaavie-800 mb-1 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Pending Booking
                    </h3>
                    <p className="text-sm text-elkaavie-600">
                      Please login to complete your reservation
                    </p>
                  </div>
                  
                  {pendingBooking && (
                    <div className="p-4 bg-white border-t border-elkaavie-100">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="w-10 h-10 bg-elkaavie-100 rounded-md flex items-center justify-center text-elkaavie-600">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {pendingBooking.roomType || `Room ${pendingBooking.roomNumber}`}
                          </p>
                          <p className="text-gray-600">
                            Room {pendingBooking.roomNumber}, Floor {pendingBooking.floor}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {resendSuccess && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg text-sm mb-6">
                  Verification email sent successfully. Please check your inbox.
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elkaavie-500 focus:border-elkaavie-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elkaavie-500 focus:border-elkaavie-500"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {showResendVerification && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={loading}
                      className="text-elkaavie-600 hover:text-elkaavie-700 font-medium text-sm"
                    >
                      {loading ? "Sending..." : "Resend verification email"}
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 text-elkaavie-600 focus:ring-elkaavie-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-elkaavie-600 hover:text-elkaavie-700">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-elkaavie-600 text-white font-medium rounded-lg hover:bg-elkaavie-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : redirectPath.includes('room-booking') ? "Login to Complete Booking" : "Sign in"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-elkaavie-600 hover:text-elkaavie-700 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default Login; 