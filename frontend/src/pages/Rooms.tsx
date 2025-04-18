import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { roomApi, Room, authApi } from "@/lib/api";
import { ChevronRight, BedDouble, Users, ArrowRight, Check, X, CreditCard, LogIn, RefreshCw } from "lucide-react";

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          await authApi.getCurrentUser();
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        setIsLoggedIn(false);
      } finally {
        setCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, []);

  // Fetch rooms function
  const fetchRooms = async () => {
    try {
      setRefreshing(true);
      const data = await roomApi.getAll();
      setRooms(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch rooms. Please try again later.");
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  // Format price to Indonesian Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };
  
  // Format price for room grid display
  const formatPriceShort = (price: number) => {
    // For 1,500,000 we want to display "1.5 jt" or "1.5 jt/bln" (1.5 million per month)
    return `${price / 1500000} jt/bln`;
  };

  // Group rooms by floor
  const getRoomsByFloor = () => {
    const roomsByFloor: { [key: number]: Room[] } = {};
    
    rooms.forEach(room => {
      const floor = room.floor || 1;
      if (!roomsByFloor[floor]) {
        roomsByFloor[floor] = [];
      }
      roomsByFloor[floor].push(room);
    });
    
    // Sort rooms within each floor by room number
    Object.keys(roomsByFloor).forEach(floorKey => {
      const floor = Number(floorKey);
      roomsByFloor[floor].sort((a, b) => {
        const numA = parseInt(a.number);
        const numB = parseInt(b.number);
        return numA - numB;
      });
    });
    
    return roomsByFloor;
  };

  // Handle booking request
  const handleBookNow = () => {
    if (!selectedRoom) return;
    
    if (isLoggedIn) {
      // If logged in, proceed to booking page
      navigate(`/room-booking?room=${selectedRoom.id}`);
    } else {
      // If not logged in, save selected room to session storage and redirect to login
      sessionStorage.setItem('pendingBooking', JSON.stringify({
        roomId: selectedRoom.id,
        roomNumber: selectedRoom.number,
        roomType: selectedRoom.roomType?.name,
        price: selectedRoom.roomType?.price,
        floor: selectedRoom.floor
      }));
      // Redirect to login with return URL
      navigate(`/login?redirect=/room-booking&room=${selectedRoom.id}`);
    }
  };

  if (loading || checkingAuth) {
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Oops! Something went wrong</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-elkaavie-600 text-white rounded-lg hover:bg-elkaavie-700 transition"
              >
                Try Again
              </button>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  const roomsByFloor = getRoomsByFloor();
  const floors = Object.keys(roomsByFloor).map(Number).sort();

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero section with image */}
        <div className="relative">
          {/* Background image with overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1600&auto=format&fit=crop')",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-elkaavie-900/80 to-elkaavie-800/70"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 py-24">
            <Container>
              <div className="text-white max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Room</h1>
                <div className="w-20 h-1 bg-elkaavie-400 mb-6"></div>
                <p className="text-xl text-white/90 mb-8">
                  Our hotel offers a variety of comfortable rooms for all your needs.
                  Select from our cinema-style layout below.
                </p>
                
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm backdrop-blur-sm">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>Modern Comfort</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm backdrop-blur-sm">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>Prime Locations</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm backdrop-blur-sm">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>Excellent Service</span>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>

        <div className="py-12 bg-gray-50">
          <Container>
            {/* Refresh button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={fetchRooms}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh Rooms'}
              </button>
            </div>
        
            {/* Booking instruction */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Book</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-elkaavie-100 text-elkaavie-600 flex items-center justify-center rounded-full mb-4">
                      <span className="font-bold">1</span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Select a Room</h3>
                    <p className="text-gray-600 text-sm">Click on an available (green) room from our floor layout</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center relative">
                    <div className="w-12 h-12 bg-elkaavie-100 text-elkaavie-600 flex items-center justify-center rounded-full mb-4">
                      <span className="font-bold">2</span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Review Details</h3>
                    <p className="text-gray-600 text-sm">Check the room details and price</p>
                    
                    <div className="hidden md:block absolute top-8 left-full -translate-x-4">
                      <ArrowRight className="text-gray-300 h-8 w-8" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-elkaavie-100 text-elkaavie-600 flex items-center justify-center rounded-full mb-4">
                      <span className="font-bold">3</span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Complete Booking</h3>
                    <p className="text-gray-600 text-sm">Click "Book Now" to finalize your reservation</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="max-w-3xl mx-auto mb-8 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Room Availability</h3>
              <div className="flex items-center justify-center gap-8">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded mr-3 shadow-sm"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-500 rounded mr-3 shadow-sm opacity-70"></div>
                  <span className="text-sm">Unavailable</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded mr-3 shadow-sm ring-2 ring-blue-500"></div>
                  <span className="text-sm">Selected</span>
                </div>
              </div>
            </div>

            {/* Selected room details */}
            {selectedRoom && (
              <div className="max-w-3xl mx-auto mb-12 overflow-hidden">
                <div className="bg-white rounded-xl shadow-md">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {selectedRoom.roomType?.name || `Room ${selectedRoom.number}`}
                        </h3>
                        <div className="flex items-center gap-4 mb-2 text-gray-600">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span className="text-sm">{selectedRoom.roomType?.capacity || 2} guests</span>
                          </div>
                          <div className="flex items-center">
                            <BedDouble className="h-4 w-4 mr-1" />
                            <span className="text-sm">Room {selectedRoom.number}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Price per month</p>
                        <p className="text-2xl font-semibold text-elkaavie-600">
                          Rp 1.500.000
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 max-w-md">{selectedRoom.description || "A comfortable room designed for your perfect stay. Includes standard amenities and professional service."}</p>
                      <button
                        onClick={handleBookNow}
                        className="flex items-center gap-2 px-6 py-3 bg-elkaavie-600 text-white rounded-lg hover:bg-elkaavie-700 transition shadow-sm"
                      >
                        {isLoggedIn ? (
                          <>
                            <CreditCard className="h-4 w-4" />
                            <span>Book Now</span>
                          </>
                        ) : (
                          <>
                            <LogIn className="h-4 w-4" />
                            <span>Login to Book</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cinema-style floor layout */}
            <div className="space-y-12 max-w-3xl mx-auto">
              {floors.map(floor => (
                <div key={floor} className="mb-8">
                  <h2 className="text-xl font-semibold bg-blue-900 text-white py-3 px-6 rounded-t-xl mb-0 text-center">
                    Floor {floor}
                  </h2>
                  
                  <div className="border border-gray-200 rounded-b-xl bg-white p-8">
                    {/* Hallway */}
                    <div className="w-full bg-gray-200 py-3 text-center text-gray-600 text-sm mb-8 rounded-lg">
                      Hallway
                    </div>
                    
                    {/* Room grid */}
                    <div className="grid grid-cols-5 gap-6 max-w-3xl mx-auto">
                      {roomsByFloor[floor].map(room => (
                        <div
                          key={room.id}
                          className={`aspect-square rounded-lg shadow-sm cursor-pointer flex items-center justify-center transition-transform hover:scale-105 ${
                            !room.is_available && 'cursor-not-allowed'
                          } ${
                            room.is_available 
                              ? "bg-green-500 hover:bg-green-600" 
                              : "bg-red-500 hover:bg-red-600 opacity-70"
                          } ${selectedRoom?.id === room.id ? "ring-4 ring-blue-500 transform scale-105" : ""}`}
                          onClick={() => {
                            if (room.is_available) {
                              setSelectedRoom(prev => prev?.id === room.id ? null : room);
                            }
                          }}
                        >
                          <div className="text-center">
                            <span className="text-white font-bold text-lg">
                              {room.number}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Rooms; 