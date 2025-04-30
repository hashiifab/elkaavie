import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // Check localStorage first, then sessionStorage
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface Room {
  id: number;
  name: string;
  number: string;
  floor: number;
  description?: string;
  status?: string;
  is_available: boolean;
  price: number;
  capacity: number;
  image_url?: string;
  amenities?: Amenity[];
  created_at?: string;
  updated_at?: string;
  
  // Untuk kompatibilitas dengan kode yang menggunakan roomType
  roomType?: {
    id: number;
    name: string;
    price: number;
    capacity: number;
  };
}

export interface RoomAvailabilityParams {
  check_in: string;
  check_out: string;
}

export interface BookingRoom {
  id: number;
  number: string;
  floor: number;
  name?: string;
  price?: number;
  capacity?: number;
  roomType?: {
    name: string;
    price: number;
  }
}

export interface Booking {
  id: number;
  room_id: number;
  user_id: number;
  check_in: string;
  check_out: string;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled" | "paid";
  total_price: number;
  payment_proof?: string;
  guests?: number;
  special_requests?: string;
  payment_method?: string;
  phone_number?: string;
  identity_card?: string;
  room?: BookingRoom;
  created_at: string;
  updated_at: string;
  payment_due_at?: string;
}

export interface BookingCreateParams {
  room_id: number;
  check_in: string;
  check_out: string;
  guests?: number;
  special_requests?: string;
  payment_method?: string;
  phone_number?: string;
  identity_card?: File;
}

export interface RoomType {
  id: number;
  name: string;
  description?: string;
  price: number;
  capacity: number;
  created_at?: string;
  updated_at?: string;
}

export interface Amenity {
  id: number;
  name: string;
  icon?: string;
  created_at?: string;
  updated_at?: string;
  pivot?: {
    room_id: number;
    amenity_id: number;
  };
}

export const authApi = {
  login: async (email: string, password: string, rememberMe = false) => {
    const response = await api.post("/login", { email, password });
    const { token, user } = response.data;
    
    // Store token based on rememberMe setting
    if (rememberMe) {
      localStorage.setItem("auth_token", token);
    } else {
      sessionStorage.setItem("auth_token", token);
    }
    localStorage.setItem("user_data", JSON.stringify(user));
    
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post("/register", data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/logout");
    return response.data;
  },

  getUser: async () => {
    const response = await api.get("/user");
    return response.data;
  },

  updateProfile: async (data: { name: string; email: string }) => {
    const response = await api.put("/user", data);
    return response.data;
  },

  associateBookings: async (email: string, phoneNumber: string) => {
    const response = await api.post("/bookings/associate", { email, phone_number: phoneNumber });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/user");
    return response.data;
  },

  verifyEmail: async (id: string, hash: string, params: { expires: string; signature: string }) => {
    const response = await api.get(`/email/verify/${id}/${hash}`, { params });
    return response.data;
  },

  verifyEmailWithCode: async (code: string) => {
    const response = await api.post("/email/verify", { code });
    return response.data;
  },

  authenticateWithVerificationCode: async (code: string, rememberMe = false) => {
    const response = await api.post("/email/verify-and-login", { code });
    const { token, user } = response.data;
    
    // Store token based on rememberMe setting
    if (rememberMe) {
      localStorage.setItem("auth_token", token);
    } else {
      sessionStorage.setItem("auth_token", token);
    }
    localStorage.setItem("user_data", JSON.stringify(user));
    
    return response.data;
  },

  resendVerificationEmail: async () => {
    const response = await api.post("/email/verification-notification");
    return response.data;
  },

  resendVerificationEmailForUser: async (email: string, password: string) => {
    const response = await api.post("/email/verification-notification/unverified", {
      email,
      password,
    });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (data: { 
    email: string; 
    password: string; 
    password_confirmation: string; 
    token: string 
  }) => {
    const response = await api.post("/reset-password", data);
    return response.data;
  },

  googleLogin: async (rememberMe = false) => {
    try {
      console.log('Starting Google login process...');
      // Store the current URL to redirect back after login
      localStorage.setItem('redirect_after_login', window.location.pathname);
      console.log('Stored redirect path:', window.location.pathname);
      
      // Use the backend's Google OAuth endpoint with remember_me parameter
      console.log('Calling backend Google OAuth endpoint...');
      const response = await api.get('/auth/google', { 
        params: { remember_me: rememberMe ? 'true' : 'false' } 
      });
      console.log('Backend response:', response.data);
      
      if (!response.data || !response.data.url) {
        console.error('Invalid response from backend:', response.data);
        throw new Error('Invalid response from backend');
      }
      
      return response.data;
    } catch (error) {
      console.error('Google login failed:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      throw error;
    }
  },
};

export const roomApi = {
  // Get all rooms
  getAll: async (): Promise<Room[]> => {
    const response = await api.get("/rooms");
    return response.data;
  },

  // Get a specific room by ID
  getById: async (id: number | string): Promise<Room> => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  // Check for available rooms based on dates
  getAvailable: async (params: RoomAvailabilityParams): Promise<Room[]> => {
    const response = await api.get("/rooms/available", { params });
    return response.data;
  },
};

export const bookingApi = {
  getAll: async () => {
    const response = await api.get("/bookings");
    return response.data;
  },
  
  getUserBookings: async () => {
    const response = await api.get("/bookings/user");
    return response.data;
  },
  
  getBookingDetails: async (id: number) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  
  create: async (data: FormData | BookingCreateParams) => {
    const config = {
      headers: {
        'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    };
    
    const response = await api.post("/bookings", data, config);
    return response.data;
  },
  
  update: async (id: number, data: Partial<Booking>) => {
    const response = await api.put(`/bookings/${id}`, data);
    return response.data;
  },
  
  cancel: async (id: number) => {
    const response = await api.post(`/bookings/${id}/cancel`);
    return response.data;
  },

  uploadPaymentProof: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("payment_proof", file);
    const response = await api.post(`/bookings/${id}/payment-proof`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default api; 