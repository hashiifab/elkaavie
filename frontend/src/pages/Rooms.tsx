import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { roomApi, Room, authApi, bookingApi } from "@/lib/api";
import { ChevronRight, BedDouble, Users, ArrowRight, Check, X, CreditCard, LogIn, RefreshCw, Info } from "lucide-react";
import { toast } from "react-hot-toast";

// Interface for user bookings
interface UserBooking {
  id: number;
  room_id: number;
  status: string;
}

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFloatingCard, setShowFloatingCard] = useState(false);
  const [userBookedRooms, setUserBookedRooms] = useState<number[]>([]);
  const [userBookings, setUserBookings] = useState<UserBooking[]>([]);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
        if (token) {
          await authApi.getCurrentUser();
          setIsLoggedIn(true);
          // Fetch user's bookings after confirming they're logged in
          fetchUserBookings();
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

  // Fetch user's bookings to identify rooms they've booked
  const fetchUserBookings = async () => {
    try {
      const response = await bookingApi.getUserBookings();
      // Extract room IDs from active bookings (not cancelled or rejected)
      const bookings = response.data || [];
      const activeBookings = bookings.filter(booking => 
        ['tertunda', 'disetujui', 'dibayar'].includes(booking.status)
      );
      
      // Store full booking objects to access booking IDs later
      setUserBookings(activeBookings.map(booking => ({
        id: booking.id,
        room_id: booking.room_id,
        status: booking.status
      })));
      
      // Extract just the room IDs for quick lookup
      const bookedRoomIds = activeBookings.map(booking => booking.room_id);
      setUserBookedRooms(bookedRoomIds);
    } catch (err) {
      console.error("Gagal mengambil pesanan pengguna:", err);
    }
  };

  // Fetch rooms function
  const fetchRooms = async () => {
    try {
      setRefreshing(true);
      const data = await roomApi.getAll();
      setRooms(data);
      setError(null);
      
      // Refresh user bookings if logged in
      if (isLoggedIn) {
        await fetchUserBookings();
      }
    } catch (err) {
      setError("Gagal mengambil kamar. Coba lagi nanti.");
      console.error("Terjadi kesalahan saat mengambil kamar:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  // Handle room selection
  useEffect(() => {
    if (selectedRoom) {
      setShowFloatingCard(true);
    } else {
      setShowFloatingCard(false);
    }
  }, [selectedRoom]);

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
      
      if (floor === 3) return;

      if (!roomsByFloor[floor]) {
        roomsByFloor[floor] = [];
      }
      roomsByFloor[floor].push(room);
    });
    
    // Tambahkan lantai 3 untuk laundry area
    roomsByFloor[3] = [];
    
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
        name: selectedRoom.name,
        roomType: selectedRoom.roomType?.name,
        price: selectedRoom.price || selectedRoom.roomType?.price,
        floor: selectedRoom.floor
      }));
      // Redirect to login with return URL
      navigate(`/login?redirect=/room-booking&room=${selectedRoom.id}`);
    }
  };

  // Check if room is booked by the current user
  const isRoomBookedByUser = (roomId: number) => {
    return userBookedRooms.includes(roomId);
  };

  // Get booking ID for a specific room
  const getBookingIdForRoom = (roomId: number): number | null => {
    const booking = userBookings.find(b => b.room_id === roomId);
    return booking ? booking.id : null;
  };

  // Handle room selection
  const handleRoomClick = (room: Room) => {
    // If room is already booked by this user, navigate to booking details
    if (isRoomBookedByUser(room.id)) {
      const bookingId = getBookingIdForRoom(room.id);
      
      if (bookingId) {
        // Navigate directly to the booking details page
        navigate(`/bookings/${bookingId}`);
      } else {
        // Fallback to profile if we can't find the specific booking
        navigate('/profile');
        
        // Show toast to inform user
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <Info className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Kamar {room.number} sudah menjadi milikmu
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Periksa pemesanan Anda untuk detailnya
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
              >
                Memberhentikan
              </button>
            </div>
          </div>
        ), { duration: 3000 });
      }
      return;
    }
    
    // If available, set as selected
    if (room.is_available) {
      setSelectedRoom(prev => prev?.id === room.id ? null : room);
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ups! Ada yang salah</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-elkaavie-600 text-white rounded-lg hover:bg-elkaavie-700 transition"
              >
                Coba lagi
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
      
      {/* Floating Card */}
      {selectedRoom && showFloatingCard && (
        <div className="fixed bottom-6 left-0 right-0 z-50 mx-auto px-4 max-w-lg">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 relative">
            {/* Close button - sekarang di pojok kanan atas */}
            <button 
              onClick={() => setSelectedRoom(null)}
              className="absolute -top-2 -right-2 p-1 bg-white hover:bg-gray-100 rounded-full transition-colors shadow-md border border-gray-200"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>

            {/* Body */}
            <div className="p-4">
              {/* Room Title */}
              <h3 className="font-semibold text-gray-900 mb-4">
                {selectedRoom.name || selectedRoom.roomType?.name || `Room ${selectedRoom.number}`}
              </h3>

              {/* Room Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{selectedRoom.capacity || selectedRoom.roomType?.capacity || 1} guests</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <BedDouble className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Room {selectedRoom.number}</span>
                </div>
              </div>

              {/* Price and Book Button */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Harga per bulan</p>
                  <p className="text-xl font-semibold text-elkaavie-600">
                    Rp 1.500.000
                  </p>
                </div>
                <button
                  onClick={handleBookNow}
                  className="flex items-center gap-2 px-6 py-2.5 bg-elkaavie-600 text-white rounded-lg hover:bg-elkaavie-700 transition shadow-sm"
                >
                  {isLoggedIn ? (
                    <>
                      <CreditCard className="h-4 w-4" />
                      <span>Pesan Sekarang</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      <span>Masuk untuk Memesan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="pt-24 pb-16">
        {/* Hero section with image */}
        <div className="relative">
          {/* Background image with overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundColor: 'green',
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-elkaavie-900/80 to-elkaavie-800/70"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 py-24">
            <Container>
              <div className="text-white max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Temukan Kamar Sempurna Anda</h1>
                <div className="w-20 h-1 bg-elkaavie-400 mb-6"></div>
                <p className="text-xl text-white/90 mb-8">
                  Hotel kami menawarkan berbagai kamar yang nyaman untuk semua kebutuhan Anda.
                  Pilih dari tata letak bergaya bioskop kami di bawah ini.
                </p>
                
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm backdrop-blur-sm">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>Kenyamanan Modern</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm backdrop-blur-sm">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>Lokasi Utama</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm backdrop-blur-sm">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>Pelayanan prima</span>
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
                {refreshing ? 'Segarkan...' : 'Segarkan'}
              </button>
            </div>
        
            {/* Booking instruction */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cara Memesan</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-elkaavie-100 text-elkaavie-600 flex items-center justify-center rounded-full mb-4">
                      <span className="font-bold">1</span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Pilih Kamar</h3>
                    <p className="text-gray-600 text-sm">Klik pada ruangan yang tersedia (hijau) dari tata letak lantai kami</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center relative">
                    <div className="w-12 h-12 bg-elkaavie-100 text-elkaavie-600 flex items-center justify-center rounded-full mb-4">
                      <span className="font-bold">2</span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Detail Ulasan</h3>
                    <p className="text-gray-600 text-sm">Periksa detail kamar dan harga</p>
                    
                    <div className="hidden md:block absolute top-8 left-full -translate-x-4">
                      <ArrowRight className="text-gray-300 h-8 w-8" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-elkaavie-100 text-elkaavie-600 flex items-center justify-center rounded-full mb-4">
                      <span className="font-bold">3</span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Pemesanan Lengkap</h3>
                    <p className="text-gray-600 text-sm">Klik "Pesan Sekarang" untuk menyelesaikan reservasi Anda</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="max-w-3xl mx-auto mb-8 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ketersediaan Kamar</h3>
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded mr-3 shadow-sm"></div>
                  <span className="text-sm">Tersedia</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-500 rounded mr-3 shadow-sm opacity-70"></div>
                  <span className="text-sm">Tidak tersedia</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-300 rounded mr-3 shadow-sm"></div>
                  <span className="text-sm">Kamar kamu</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded mr-3 shadow-sm ring-2 ring-orange-500"></div>
                  <span className="text-sm">Terpilih</span>
                </div>
              </div>
            </div>

            {/* Cinema-style floor layout */}
            <div className="space-y-12 max-w-3xl mx-auto">
              {floors.map(floor => (
                <div key={floor} className="mb-8">
                  <h2 className="text-xl font-semibold bg-blue-900 text-white py-3 px-6 rounded-t-xl mb-0 text-center">
                    {floor === 3 ? 'Laundry Area' : `Floor ${floor}`}
                  </h2>
                  
                  <div className="border border-gray-200 rounded-b-xl bg-white p-8">
                    {/* Hallway */}
                    <div className="w-full bg-gray-200 py-3 text-center text-gray-600 text-sm mb-8 rounded-lg">
                      Hallway
                    </div>
                    
                    {floor === 3 ? (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-elkaavie-100 rounded-full mb-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V7M3 7H21M3 7V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V7M8 11H16M8 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Laundry Area</h3>
                        <p className="text-gray-600">Area penjemuran dan cuci pakaian untuk penghuni</p>
                      </div>
                    ) : (
                    <div className="grid grid-cols-5 gap-6 max-w-3xl mx-auto">
                        {roomsByFloor[floor].map((room) => {
                          // Determine if this room is booked by the user
                          const isUserBooked = isRoomBookedByUser(room.id);
                          
                          return (
                            <div
                              key={room.id}
                              className={`aspect-square rounded-lg shadow-sm flex items-center justify-center ${
                                !room.is_available && !isUserBooked 
                                  ? 'cursor-not-allowed opacity-70 bg-red-500' 
                                  : isUserBooked 
                                    ? "cursor-pointer bg-blue-300 hover:bg-blue-400 hover:shadow-md transition-all hover:scale-105" 
                                    : room.is_available 
                                      ? "cursor-pointer bg-green-500 hover:bg-green-600 hover:shadow-md transition-all hover:scale-105" 
                                      : ""
                              } ${selectedRoom?.id === room.id ? "ring-4 ring-orange-500 transform scale-105" : ""}`}
                              onClick={() => {
                                if (room.is_available || isUserBooked) {
                                  handleRoomClick(room);
                                }
                              }}
                            >
                              <div className="text-center">
                                <span className={`font-bold text-lg text-white`}>
                                  {room.number}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    )}
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