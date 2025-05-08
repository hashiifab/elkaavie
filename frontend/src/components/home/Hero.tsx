
import React, { useState, useEffect } from "react";
import Container from "../ui/Container";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { roomApi, bookingApi } from "@/lib/api";

const Hero = () => {
  const { translations, language } = useLanguage();
  const [hasAvailableRooms, setHasAvailableRooms] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userBookedRoomIds, setUserBookedRoomIds] = useState<number[]>([]);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch user's bookings if logged in
  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!isLoggedIn) return;

      try {
        const response = await bookingApi.getUserBookings();
        const bookings = response.data || [];

        // Get active bookings (not cancelled, rejected, or completed)
        const activeBookings = bookings.filter((booking: any) =>
          ['pending', 'approved', 'paid'].includes(booking.status)
        );

        // Extract room IDs from active bookings
        const bookedRoomIds = activeBookings.map((booking: any) => booking.room_id);
        setUserBookedRoomIds(bookedRoomIds);
      } catch (error) {
        console.error("Error fetching user bookings:", error);
      }
    };

    if (isLoggedIn) {
      fetchUserBookings();
    }
  }, [isLoggedIn]);

  // Check room availability
  useEffect(() => {
    const checkRoomAvailability = async () => {
      try {
        const rooms = await roomApi.getAll();
        console.log("Fetched rooms:", rooms);

        // Check if rooms is an array and has data
        if (!Array.isArray(rooms) || rooms.length === 0) {
          console.warn("No rooms data received or invalid format");
          setHasAvailableRooms(false);
          return;
        }

        // Filter rooms that are both available AND not booked by the current user
        const availableRooms = rooms.filter(room => {
          const isAvailable = room.is_available === true;
          const isBookedByUser = userBookedRoomIds.includes(room.id);

          // A room is considered "available for booking" if:
          // 1. It's marked as available in the system AND
          // 2. It's not already booked by the current user
          return isAvailable && !isBookedByUser;
        });

        console.log("Available rooms (not booked by user):", availableRooms);
        console.log("Are any rooms available for booking:", availableRooms.length > 0);

        setHasAvailableRooms(availableRooms.length > 0);
      } catch (error) {
        console.error("Error checking room availability:", error);
        // Default to showing rooms as NOT available if there's an error
        setHasAvailableRooms(false);
      }
    };

    checkRoomAvailability();
  }, [userBookedRoomIds]);

  return (
    <section id="home" className="pt-32 pb-24 md:pt-44 md:pb-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-elkaavie-50/80 to-white pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in">
            <span className="inline-block px-3 py-1 bg-elkaavie-100 text-elkaavie-800 rounded-full text-sm font-medium mb-6">
              {translations.home.hero.title}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {translations.home.hero.subtitle}
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg">
              {translations.home.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#book"
                className="inline-flex items-center justify-center px-6 py-3 bg-elkaavie-500 text-white font-medium rounded-lg shadow-md hover:bg-elkaavie-600 transition duration-200 text-center hover-scale"
              >
                {translations.home.hero.cta.inquire}
                <ArrowRight size={18} className="ml-2" />
              </a>
              <a
                href="#facilities"
                className="inline-flex items-center justify-center px-6 py-3 border border-elkaavie-200 text-elkaavie-700 font-medium rounded-lg hover:bg-elkaavie-50 transition duration-200 text-center"
              >
                {translations.home.hero.cta.viewFacilities}
              </a>
            </div>
          </div>

          <div className="relative animate-fade-in">
            <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-[4/3]">
              <div className="absolute inset-0 bg-gradient-to-r from-elkaavie-400/20 to-elkaavie-300/10 mix-blend-multiply z-10 rounded-2xl" />
              <img
                src="../public/WhatsApp Image 2025-04-19 at 21.40.09.jpeg"
                alt="Elkaavie Kost"
                className="object-cover w-full h-full transform transition duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>

            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-elkaavie-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />

            {/* Floating Card */}
            <div className="absolute bottom-6 -right-6 md:right-6 bg-white rounded-lg shadow-lg p-4 w-56 animate-fade-in">
              <div className="flex items-center mb-2">
                <div className={`w-3 h-3 ${hasAvailableRooms ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-2`}></div>
                <p className="text-sm font-medium text-gray-900">
                  {hasAvailableRooms
                    ? (language === 'id' ? 'Tersedia' : translations.rooms.available)
                    : (language === 'id' ? 'Tidak Tersedia' : translations.rooms.notAvailable)
                  }
                </p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {language === 'id' ? 'Kamar Eksklusif' : translations.home.room.title}
              </p>
              <p className="text-sm text-gray-500">
                {language === 'id' ? '3x3 meter Luas Kamar & Kamar Mandi Dalam' : translations.home.room.size}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
