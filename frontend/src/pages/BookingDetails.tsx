import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { bookingApi } from "@/lib/api";
import { Calendar, MapPin, User, Clock, CreditCard, ChevronRight, Phone, FileText, Home } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

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

interface Booking {
  duration_months: number;
  id: number;
  room_id: number;
  check_in: string;
  check_out: string;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled" | "paid";
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
    roomType?: {
      name: string;
      price: number;
    }
  };
  created_at: string;
}

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await bookingApi.getBookingDetails(Number(id));
        setBooking(response.data);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError(translations.auth.bookingDetails.errors.failedToLoad);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

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
      case "paid":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  if (error || !booking) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16">
          <Container>
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{translations.auth.bookingDetails.errors.title}</h2>
              <p className="text-gray-600 mb-6">{error || translations.auth.bookingDetails.errors.bookingNotFound}</p>
              <button
                onClick={() => navigate("/profile")}
                className="px-6 py-2 bg-elkaavie-600 text-white rounded-lg hover:bg-elkaavie-700 transition"
              >
                {translations.auth.bookingDetails.navigation.backToProfile}
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
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-gray-600">
              <button onClick={() => navigate("/")} className="hover:text-elkaavie-600">
                <Home className="h-4 w-4" />
              </button>
              <ChevronRight className="h-4 w-4 mx-2" />
              <button onClick={() => navigate("/profile")} className="hover:text-elkaavie-600">
                {translations.auth.profile.navigation.profile}
              </button>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span>{translations.auth.bookingDetails.navigation.bookingDetails}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-elkaavie-100 text-elkaavie-600 rounded-full flex items-center justify-center">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">
                    {booking.room?.roomType?.name || `Room ${booking.room?.number}`}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {translations.auth.bookingDetails.details.bookingId}: #{booking.id}
                  </p>
                </div>
              </div>
              <div
                className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadgeClass(
                  booking.status
                )}`}
              >
                {translations.auth.bookingDetails.status[booking.status as keyof typeof translations.auth.bookingDetails.status]}
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">{translations.auth.bookingDetails.details.checkInOut}</p>
                  <p className="text-gray-600">
                    {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {booking.duration_months || 1} {(booking.duration_months || 1) === 1 ?
                      translations.auth.bookingDetails.details.month || "Month" :
                      translations.auth.bookingDetails.details.months || "Months"}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">{translations.auth.bookingDetails.details.roomDetails}</p>
                  <p className="text-gray-600">
                    {translations.auth.bookingDetails.details.room} {booking.room?.number}, {translations.auth.bookingDetails.details.floor} {booking.room?.floor}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">{translations.auth.bookingDetails.details.guests}</p>
                  <p className="text-gray-600">
                    {booking.guests || 1} {booking.guests === 1 ? translations.auth.bookingDetails.details.guest : translations.auth.bookingDetails.details.guests}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">{translations.auth.bookingDetails.details.bookedOn}</p>
                  <p className="text-gray-600">
                    {formatDate(booking.created_at)}
                  </p>
                </div>
              </div>

              {booking.special_requests && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-700">{translations.auth.bookingDetails.details.specialRequests}</p>
                  <p className="text-gray-600">{booking.special_requests}</p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-600">{translations.auth.bookingDetails.details.total}</p>
                  <p className="text-lg font-semibold text-elkaavie-600">
                    {formatPrice(booking.total_price)}
                  </p>
                  {booking.status === "approved" && booking.payment_due_at && (
                    <div className="mt-2">
                      <CountdownTimer dueDate={booking.payment_due_at} />
                    </div>
                  )}
                </div>
              </div>

              {/* Status-specific actions */}
              <div className="space-y-4">
                {booking.status === "approved" && (
                  <>
                    {booking.payment_proof ? (
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800">{translations.paymentGuide.notifications.verificationPending.title}</p>
                            <p className="text-sm text-yellow-700">
                              {translations.paymentGuide.notifications.verificationPending.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => navigate(`/bookings/${booking.id}/payment-guide`)}
                        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        {translations.auth.bookingDetails.actions.continuePayment}
                      </button>
                    )}
                  </>
                )}

                {booking.status === "paid" && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-green-800">{translations.auth.bookingDetails.statusMessages.paid.title}</p>
                        <p className="text-sm text-green-700">
                          {translations.auth.bookingDetails.statusMessages.paid.message.replace('{date}', formatDate(booking.check_in))}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {booking.status === "pending" && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">{translations.auth.bookingDetails.statusMessages.pending.title}</p>
                        <p className="text-sm text-yellow-700">
                          Your booking is pending approval. Please contact our admin at{" "}
                          <a href="tel:+628179370631" className="font-medium underline">
                            +62 817-937-0631
                          </a>{" "}
                          to expedite the process.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {(booking.status === "rejected" || booking.status === "cancelled") && (
                  <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-red-800">
                            {booking.status === "rejected"
                              ? translations.auth.bookingDetails.statusMessages.rejected.title
                              : translations.auth.bookingDetails.statusMessages.cancelled.title}
                          </p>
                          <p className="text-sm text-red-700">
                            {booking.status === "rejected"
                              ? translations.auth.bookingDetails.statusMessages.rejected.message
                              : translations.auth.bookingDetails.statusMessages.cancelled.message}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate("/rooms")}
                      className="w-full py-3 bg-elkaavie-600 text-white rounded-lg hover:bg-elkaavie-700 transition flex items-center justify-center"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      {translations.auth.bookingDetails.actions.submitNewBooking}
                    </button>
                  </div>
                )}

                {booking.status === "completed" && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-green-800">{translations.auth.bookingDetails.statusMessages.completed.title}</p>
                        <p className="text-sm text-green-700">
                          {translations.auth.bookingDetails.statusMessages.completed.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default BookingDetails;