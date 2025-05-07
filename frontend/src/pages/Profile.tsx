import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { authApi, bookingApi } from "@/lib/api";
import { User, Mail, Calendar, MapPin, Clock, CreditCard, ChevronRight, Home, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface UserData {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

interface Booking {
  id: number;
  room_id: number;
  check_in: string;
  check_out: string;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  total_price: number;
  guests?: number;
  phone_number?: string;
  special_requests?: string;
  payment_method?: string;
  identity_card?: string;
  payment_due_at?: string;
  room?: {
    id: number;
    number: string;
    floor: number;
    name?: string;
    roomType?: {
      name: string;
      price: number;
    }
  };
  created_at: string;
}

// Countdown Timer Component
const CountdownTimer = ({ dueDate }: { dueDate: string }) => {
  const { translations } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const due = new Date(dueDate).getTime();
      const now = new Date().getTime();
      const difference = due - now;

      if (difference <= 0) {
        setExpired(true);
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [dueDate]);

  if (expired) {
    return (
      <div className="text-red-600 text-sm font-medium">
        {translations.auth.profile.bookings.details.paymentDeadlineExpired}
      </div>
    );
  }

  return (
    <div className="text-sm">
      <span className="font-medium text-gray-700">{translations.auth.profile.bookings.details.paymentDueIn}: </span>
      <span className="font-semibold text-elkaavie-600">
        {timeLeft.hours.toString().padStart(2, '0')}:
        {timeLeft.minutes.toString().padStart(2, '0')}:
        {timeLeft.seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const user = await authApi.getUser();
      setUserData(user);
      return user;
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(translations.auth.profile.errors.failedToLoad);
      navigate("/login");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch user bookings
  const fetchUserBookings = async () => {
    try {
      setBookingsLoading(true);
      const response = await bookingApi.getUserBookings();
      // Extract the data array from the response
      setUserBookings(response.data || []);
    } catch (err) {
      console.error("Error fetching user bookings:", err);
    } finally {
      setBookingsLoading(false);
    }
  };

  // Refresh all data
  const refreshData = async () => {
    setRefreshing(true);
    const user = await fetchUserData();
    if (user) {
      await fetchUserBookings();
    }
    setRefreshing(false);
  };

  // Initial data load
  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  // Fetch user bookings when userData is available
  useEffect(() => {
    if (userData) {
      fetchUserBookings();
    }
  }, [userData]);

  // Filter bookings by status
  const filteredBookings = selectedStatus
    ? userBookings.filter(booking => booking.status === selectedStatus)
    : userBookings;

  // Format price to Indonesian Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status count
  const getStatusCount = (status: string) => {
    return userBookings.filter(booking => booking.status === status).length;
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16">
          <Container>
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-elkaavie-600"></div>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16">
          <Container>
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.auth.profile.errors.title}</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 bg-elkaavie-600 text-white rounded-lg hover:bg-elkaavie-700 transition"
              >
                {translations.auth.profile.navigation.backToHome}
              </button>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <Container>
          {/* Breadcrumb and Refresh Button */}
          <div className="mb-8 flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-600">
              <button onClick={() => navigate("/")} className="hover:text-elkaavie-600">
                <Home className="h-4 w-4" />
              </button>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span>{translations.auth.profile.navigation.profile}</span>
            </div>

            <button
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? translations.auth.profile.actions.refreshing : translations.auth.profile.actions.refreshData}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* User Info Card */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-elkaavie-600 to-elkaavie-800 px-6 py-8 text-white">
                  <div className="w-20 h-20 rounded-full bg-white text-elkaavie-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <h2 className="text-xl font-semibold text-center">{userData?.name}</h2>
                  <p className="text-elkaavie-100 text-center text-sm">{userData?.role || translations.auth.profile.userInfo.guest}</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{translations.auth.profile.userInfo.email}</p>
                      <p className="text-gray-600">{userData?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{translations.auth.profile.userInfo.memberSince}</p>
                      <p className="text-gray-600">
                        {userData?.created_at
                          ? formatDate(userData.created_at)
                          : "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() => navigate("/settings")}
                      className="w-full py-2 text-sm text-elkaavie-600 border border-elkaavie-600 rounded-lg hover:bg-elkaavie-50 transition"
                    >
                      {translations.auth.profile.actions.editProfile}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings Section */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 p-6">
                  <h2 className="text-xl font-semibold">{translations.auth.profile.bookings.title}</h2>
                </div>

                {/* Status Filter */}
                <div className="border-b border-gray-200 p-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedStatus(null)}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
                        selectedStatus === null
                          ? "bg-elkaavie-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {translations.auth.profile.bookings.filters.all} ({userBookings.length})
                    </button>
                    <button
                      onClick={() => setSelectedStatus("pending")}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
                        selectedStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {translations.auth.profile.bookings.filters.pending} ({getStatusCount("pending")})
                    </button>
                    <button
                      onClick={() => setSelectedStatus("approved")}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
                        selectedStatus === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {translations.auth.profile.bookings.filters.approved} ({getStatusCount("approved")})
                    </button>
                    <button
                      onClick={() => setSelectedStatus("rejected")}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
                        selectedStatus === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {translations.auth.profile.bookings.filters.rejected} ({getStatusCount("rejected")})
                    </button>
                    <button
                      onClick={() => setSelectedStatus("cancelled")}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
                        selectedStatus === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {translations.auth.profile.bookings.filters.cancelled} ({getStatusCount("cancelled")})
                    </button>
                    <button
                      onClick={() => setSelectedStatus("completed")}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
                        selectedStatus === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {translations.auth.profile.bookings.filters.completed} ({getStatusCount("completed")})
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {bookingsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-elkaavie-600"></div>
                    </div>
                  ) : filteredBookings.length > 0 ? (
                    <div className="space-y-6">
                      {filteredBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-elkaavie-100 text-elkaavie-600 rounded-full flex items-center justify-center">
                                <CreditCard className="h-5 w-5" />
                              </div>
                              <div className="ml-4">
                                <h3 className="font-medium text-gray-900">
                                  {booking.room?.name || booking.room?.roomType?.name || `Room ${booking.room?.number}`}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {translations.auth.profile.bookings.details.bookingId}: #{booking.id}
                                </p>
                              </div>
                            </div>
                            <div
                              className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadgeClass(
                                booking.status
                              )}`}
                            >
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </div>
                          </div>

                          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start">
                              <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">{translations.auth.profile.bookings.details.checkInOut}</p>
                                <p className="text-gray-600">
                                  {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">{translations.auth.profile.bookings.details.roomDetails}</p>
                                <p className="text-gray-600">
                                  {translations.auth.roomBooking.summary.room} {booking.room?.number}, {translations.auth.roomBooking.summary.floor} {booking.room?.floor}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">{translations.auth.profile.bookings.details.guests}</p>
                                <p className="text-gray-600">
                                  {booking.guests || 1} {booking.guests === 1 ? translations.auth.profile.bookings.details.guest : translations.auth.profile.bookings.details.guests}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">{translations.auth.profile.bookings.details.bookedOn}</p>
                                <p className="text-gray-600">
                                  {formatDate(booking.created_at)}
                                </p>
                              </div>
                            </div>

                            {booking.special_requests && (
                              <div className="md:col-span-2">
                                <p className="text-sm font-medium text-gray-700">{translations.auth.profile.bookings.details.specialRequests}</p>
                                <p className="text-gray-600">{booking.special_requests}</p>
                              </div>
                            )}
                          </div>

                          <div className="border-t border-gray-200 px-6 py-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                              <div>
                                <p className="text-sm text-gray-600">{translations.auth.profile.bookings.details.total}</p>
                                <p className="text-lg font-semibold text-elkaavie-600">
                                  {formatPrice(booking.total_price)}
                                </p>
                                {booking.status === "approved" && booking.payment_due_at && (
                                  <div className="mt-2">
                                    <CountdownTimer dueDate={booking.payment_due_at} />
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col sm:flex-row gap-2">
                                {booking.status === "approved" && (
                                  <button
                                    onClick={() => navigate(`/bookings/${booking.id}/payment-guide`)}
                                    className="w-full sm:w-auto text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                  >
                                    {translations.auth.profile.actions.continuePayment}
                                  </button>
                                )}
                                <button
                                  onClick={() => navigate(`/bookings/${booking.id}`)}
                                  className="w-full sm:w-auto text-sm px-4 py-2 bg-elkaavie-600 text-white rounded-lg hover:bg-elkaavie-700 transition flex items-center justify-center"
                                >
                                  {translations.auth.profile.actions.viewDetails}
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{translations.auth.profile.bookings.empty.title}</h3>
                      <p className="text-gray-600 mb-6">
                        {selectedStatus
                          ? translations.auth.profile.bookings.empty.noFilteredBookings.replace('{status}', selectedStatus)
                          : translations.auth.profile.bookings.empty.noBookingsYet}
                      </p>
                      <button
                        onClick={() => navigate("/rooms")}
                        className="px-6 py-2 bg-elkaavie-600 text-white rounded-lg hover:bg-elkaavie-700 transition"
                      >
                        {translations.auth.profile.actions.browseRooms}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default Profile;