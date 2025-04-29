import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { roomApi, bookingApi, Room, BookingCreateParams } from "@/lib/api";
import {
  Calendar,
  BedDouble,
  Users,
  CreditCard,
  CalendarDays,
  Info,
  Camera,
  Upload,
  Phone,
} from "lucide-react";


/**
 * RoomBooking Component
 * 
 * Handles the room booking process including:
 * - Fetching room details
 * - Date selection for check-in and check-out
 * - User information collection
 * - ID verification upload
 * - Form submission to create booking
 */
const RoomBooking = () => {
  // Get room ID from URL parameters and setup navigation
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get("room");

  // Component state management
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Form data state with all booking fields
  const [formData, setFormData] = useState({
    check_in: "",
    check_out: "",
    guests: 1,
    special_requests: "",
    payment_method: "credit_card",
    phone_number: "",
    identity_card: null as File | null,
    identity_card_preview: "",
  });

  // Date calculations for setting defaults and validation
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Set default check-out to 1 month from today (monthly rental model)
  const defaultCheckOut = new Date(today);
  defaultCheckOut.setMonth(defaultCheckOut.getMonth() + 1);

  /**
   * Format date object to YYYY-MM-DD format for input fields
   */
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  // Calculate date constraints for the form
  const minCheckIn = formatDateForInput(today);
  const minCheckOut = formatDateForInput(tomorrow);
  const defaultCheckInDate = formatDateForInput(today);
  const defaultCheckOutDate = formatDateForInput(defaultCheckOut);

  /**
   * Format price to Indonesian Rupiah currency format
   */
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  /**
   * Calculate the number of months between check-in and check-out dates
   * Used for price calculation (monthly rental model)
   */
  const calculateMonths = () => {
    if (!formData.check_in || !formData.check_out) return 0;

    const checkIn = new Date(formData.check_in);
    const checkOut = new Date(formData.check_out);

    // If dates are in the same month and year, return 1
    if (
      checkIn.getMonth() === checkOut.getMonth() &&
      checkIn.getFullYear() === checkOut.getFullYear()
    ) {
      return 1;
    }

    // Calculate months difference
    const months =
      (checkOut.getFullYear() - checkIn.getFullYear()) * 12 +
      (checkOut.getMonth() - checkIn.getMonth());

    // If check-out day is less than check-in day, it's not a full month
    if (checkOut.getDate() < checkIn.getDate()) {
      return months;
    }

    return months;
  };

  /**
   * Calculate total booking price based on number of months
   * Standard rate is 1.5 million IDR per month
   */
  const calculateTotal = () => {
    const months = calculateMonths();
    // Standard price per month is 1.5 million
    return months * 1500000;
  };

  /**
   * Fetch room data from API on component mount
   * Handles pending booking data from session storage (after login redirect)
   */
  useEffect(() => {
    const fetchRoom = async () => {
      // Check if user is coming from login with pending booking
      const pendingBookingData = sessionStorage.getItem("pendingBooking");

      if (!roomId && !pendingBookingData) {
        setError("No room selected. Please select a room first.");
        setLoading(false);
        return;
      }

      try {
        // If roomId is available, use it; otherwise, use the one from pendingBooking
        let selectedRoomId = roomId;

        if (!selectedRoomId && pendingBookingData) {
          const pendingBooking = JSON.parse(pendingBookingData);
          selectedRoomId = pendingBooking.roomId;
        }

        if (!selectedRoomId) {
          setError("No room selected. Please select a room first.");
          setLoading(false);
          return;
        }

        // Fetch room data from API
        const data = await roomApi.getById(parseInt(selectedRoomId));

        // Check if room is still available
        if (!data.is_available) {
          setError(
            "This room is no longer available. Please select another room."
          );
        } else {
          setRoom(data);

          // Set default dates to 1 month period
          setFormData((prev) => ({
            ...prev,
            check_in: defaultCheckInDate,
            check_out: defaultCheckOutDate,
            guests: data.roomType?.capacity || 1,
          }));
        }

        // Clean up pending booking data after successful retrieval
        if (pendingBookingData) {
          sessionStorage.removeItem("pendingBooking");
        }
      } catch (err) {
        console.error("Error fetching room:", err);
        setError("Failed to load room details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  /**
   * Handle form input changes for all text/select inputs
   */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle ID card file upload with validation
   * Creates preview URL for displaying the image
   */
  const handleIdentityCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type - only accept images
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return;
      }

      // Update state with file and create preview URL
      setFormData((prev) => ({
        ...prev,
        identity_card: file,
        identity_card_preview: URL.createObjectURL(file),
      }));
      setError(null);
    }
  };

  /**
   * Handle form submission to create a booking
   * Uses FormData for file upload along with other booking details
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("room_id", roomId!);
      formDataToSend.append("check_in", formData.check_in);
      formDataToSend.append("check_out", formData.check_out);
      formDataToSend.append("guests", formData.guests.toString());
      formDataToSend.append("special_requests", formData.special_requests);
      formDataToSend.append("payment_method", formData.payment_method);
      formDataToSend.append("phone_number", formData.phone_number);

      // Only append ID card if provided
      if (formData.identity_card) {
        formDataToSend.append("identity_card", formData.identity_card);
      }

      // Submit booking to API
      await bookingApi.create(formDataToSend as unknown as BookingCreateParams);
      setBookingSuccess(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Error booking room:", err);
      setError("Failed to process your booking. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  // Display loading state while fetching room data
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

  // Display error state if room not found or no longer available
  if (error) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16">
          <Container>
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => navigate("/rooms")}
                className="px-6 py-2 bg-elkaavie-600 text-white rounded-lg hover:bg-elkaavie-700 transition"
              >
                Back to Rooms
              </button>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  if (bookingSuccess) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16">
          <Container>
            <div className="max-w-3xl mx-auto text-center py-12">
              <div className="w-16 h-16 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Booking Submitted for Approval
              </h2>
              <p className="text-gray-600 mb-8">
                Your booking request has been submitted and is pending admin
                approval. We will review your application and contact you soon
                with the result.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/profile")}
                  className="px-6 py-3 bg-elkaavie-600 text-white rounded-lg hover:bg-elkaavie-700 transition"
                >
                  View My Bookings
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-white text-elkaavie-600 border border-elkaavie-600 rounded-lg hover:bg-elkaavie-50 transition"
                >
                  Return to Home
                </button>
              </div>
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
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="text-elkaavie-600 font-medium flex items-center gap-2 hover:underline"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              Back to Room Selection
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Complete Your Booking
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <CalendarDays className="w-5 h-5 mr-2 text-elkaavie-600" />
                      Booking Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="check_in"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Check-in Date
                        </label>
                        <input
                          type="date"
                          id="check_in"
                          name="check_in"
                          value={formData.check_in}
                          onChange={handleChange}
                          min={minCheckIn}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elkaavie-500 focus:border-elkaavie-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="check_out"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Check-out Date
                        </label>
                        <input
                          type="date"
                          id="check_out"
                          name="check_out"
                          value={formData.check_out}
                          onChange={handleChange}
                          min={minCheckOut}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elkaavie-500 focus:border-elkaavie-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="guests"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Number of Guests
                      </label>
                      <select
                        id="guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elkaavie-500 focus:border-elkaavie-500"
                      >
                        {Array.from(
                          { length: room?.roomType?.capacity || 1 },
                          (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} {i === 0 ? "Guest" : "Guests"}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="phone_number"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phone_number"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          required
                          placeholder="Enter your phone number"
                          className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elkaavie-500 focus:border-elkaavie-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Identity Card
                      </label>
                      <div 
                        className={`mt-1 border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${formData.identity_card_preview ? 'bg-gray-50' : 'hover:border-elkaavie-400'} ${error ? 'border-red-300' : 'border-gray-300'}`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!formData.identity_card_preview) {
                            e.currentTarget.classList.add('border-elkaavie-500', 'bg-elkaavie-50');
                          }
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!formData.identity_card_preview) {
                            e.currentTarget.classList.remove('border-elkaavie-500', 'bg-elkaavie-50');
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.classList.remove('border-elkaavie-500', 'bg-elkaavie-50');
                          
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            const file = e.dataTransfer.files[0];
                            
                            // Check file type - only accept images
                            if (!file.type.startsWith("image/")) {
                              setError("Please upload an image file");
                              return;
                            }
                            
                            // Check file size (max 5MB)
                            if (file.size > 5 * 1024 * 1024) {
                              setError("File size should be less than 5MB");
                              return;
                            }
                            
                            // Update state with file and create preview URL
                            setFormData((prev) => ({
                              ...prev,
                              identity_card: file,
                              identity_card_preview: URL.createObjectURL(file),
                            }));
                            setError(null);
                          }
                        }}
                      >
                        <input
                          id="identity_card"
                          name="identity_card"
                          type="file"
                          accept="image/jpeg,image/png,image/jpg"
                          onChange={handleIdentityCardUpload}
                          className="hidden"
                          required
                        />
                        
                        {formData.identity_card_preview ? (
                          <div className="space-y-4">
                            <div className="relative mx-auto max-w-sm overflow-hidden rounded-lg border shadow-sm">
                              <img
                                src={formData.identity_card_preview}
                                alt="Identity Card Preview"
                                className="h-auto w-full object-contain max-h-64"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (formData.identity_card_preview) {
                                    URL.revokeObjectURL(formData.identity_card_preview);
                                  }
                                  setFormData((prev) => ({
                                    ...prev,
                                    identity_card: null,
                                    identity_card_preview: "",
                                  }));
                                }}
                                className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow hover:bg-white transition-colors"
                              >
                                <svg
                                  className="w-5 h-5 text-red-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 text-center">
                              {formData.identity_card?.name} - {formData.identity_card ? (formData.identity_card.size / 1024 / 1024).toFixed(2) : 0}MB
                            </p>
                          </div>
                        ) : (
                          <label
                            htmlFor="identity_card"
                            className="flex flex-col items-center justify-center gap-3 cursor-pointer py-6"
                          >
                            <div className="p-4 bg-elkaavie-100 rounded-full">
                              <Camera className="h-8 w-8 text-elkaavie-600" />
                            </div>
                            <div className="text-center space-y-1">
                              <p className="font-semibold text-gray-800">
                                Click to upload or drag & drop
                              </p>
                              <p className="text-sm text-gray-500">
                                JPG or PNG (Max 5MB)
                              </p>
                            </div>
                          </label>
                        )}
                      </div>
                      {error && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {error}
                          </p>
                        </div>
                      )}
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-700 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Upload a clear photo of your ID card (KTP/SIM/Passport)
                        </p>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="special_requests"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Special Requests
                      </label>
                      <textarea
                        id="special_requests"
                        name="special_requests"
                        value={formData.special_requests}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Let us know if you have any special requests or requirements"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elkaavie-500 focus:border-elkaavie-500"
                      ></textarea>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200 space-y-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-elkaavie-600" />
                      Payment Method
                    </h2>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id="credit_card"
                          name="payment_method"
                          value="credit_card"
                          checked={formData.payment_method === "credit_card"}
                          onChange={handleChange}
                          className="h-4 w-4 text-elkaavie-600 focus:ring-elkaavie-500 border-gray-300"
                        />
                        <label
                          htmlFor="credit_card"
                          className="text-sm font-medium text-gray-700"
                        >
                          Credit Card (Payment at hotel)
                        </label>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id="bank_transfer"
                          name="payment_method"
                          value="bank_transfer"
                          checked={formData.payment_method === "bank_transfer"}
                          onChange={handleChange}
                          className="h-4 w-4 text-elkaavie-600 focus:ring-elkaavie-500 border-gray-300"
                        />
                        <label
                          htmlFor="bank_transfer"
                          className="text-sm font-medium text-gray-700"
                        >
                          Bank Transfer
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={
                        submitting ||
                        !formData.identity_card ||
                        !formData.phone_number
                      }
                      className="px-6 py-3 bg-elkaavie-600 text-white font-medium rounded-lg hover:bg-elkaavie-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-l-2 border-white"></span>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit for Approval</span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Booking Summary */}
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-28">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold mb-4">
                    Booking Summary
                  </h2>

                  <div className="space-y-2">
                    <div className="flex items-start">
                      <BedDouble className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium">
                          {room?.roomType?.name || `Room ${room?.number}`}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Room {room?.number}, Floor {room?.floor}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Users className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium">
                          {formData.guests}{" "}
                          {formData.guests === 1 ? "Guest" : "Guests"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Max capacity: {room?.roomType?.capacity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium">
                          {calculateMonths()}{" "}
                          {calculateMonths() === 1 ? "Month" : "Months"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formData.check_in && formData.check_out && (
                            <>
                              {new Date(formData.check_in).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                              {" - "}
                              {new Date(formData.check_out).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Monthly Rate</span>
                      <span className="font-medium">Rp 1.500.000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Number of Months</span>
                      <span className="font-medium">{calculateMonths()}</span>
                    </div>
                    {formData.guests > 1 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Extra Guests</span>
                        <span className="font-medium">
                          {formData.guests - 1}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold text-elkaavie-600">
                        {formatPrice(calculateTotal())}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Taxes and service fees included
                    </p>
                  </div>

                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">Cancellation Policy</p>
                        <p>
                          Free cancellation up to 24 hours before check-in.
                          Cancellations after this time may be subject to a fee.
                        </p>
                      </div>
                    </div>
                  </div>
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

export default RoomBooking;
