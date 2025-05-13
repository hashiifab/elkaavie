import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/web_enabled_api_service.dart';
import 'login_screen.dart';
import 'dashboard_tab.dart';
import 'users_tab.dart' hide AppColors;
import 'rooms_tab.dart';
import 'bookings_tab.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../main.dart';


class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> with SingleTickerProviderStateMixin {
  final _apiService = WebEnabledApiService();
  Map<String, dynamic>? _userData;
  bool _isLoading = true;
  late TabController _tabController;

  // Data
  List<dynamic> _users = [];
  List<dynamic> _rooms = [];
  List<dynamic> _bookings = [];

  // Loading states
  bool _loadingUsers = false;
  bool _loadingRooms = false;
  bool _loadingBookings = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _loadUserData();
    _loadAllData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadUserData() async {
    try {
      final userData = await _apiService.getUser();
      if (mounted) {
        setState(() {
          _userData = userData;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const LoginScreen()),
        );
      }
    }
  }

  Future<void> _loadAllData() async {
    await Future.wait([
      _loadUsers(),
      _loadRooms(),
      _loadBookings(),
    ]);
  }

  Future<void> _loadUsers() async {
    if (mounted) setState(() => _loadingUsers = true);
    try {
      final users = await _apiService.getUsers();
      if (mounted) {
        setState(() {
          _users = users;
          _loadingUsers = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _loadingUsers = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load users: ${e.toString()}')),
        );
      }
    }
  }

  Future<void> _loadRooms() async {
    if (mounted) setState(() => _loadingRooms = true);
    try {
      final rooms = await _apiService.getRooms();
      if (mounted) {
        setState(() {
          _rooms = rooms;
          _loadingRooms = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _loadingRooms = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load rooms: ${e.toString()}')),
        );
      }
    }
  }

  Future<void> _loadBookings() async {
    if (mounted) setState(() => _loadingBookings = true);
    try {
      final bookings = await _apiService.getBookings();
      if (mounted) {
        setState(() {
          _bookings = bookings;
          _loadingBookings = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _loadingBookings = false);
    }
  }

  Future<void> _logout() async {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(child: CircularProgressIndicator()),
    );
    try {
      await _apiService.logout();
      if (mounted) {
        Navigator.pop(context);
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const LoginScreen()),
        );
      }
    } catch (e) {
      if (mounted && Navigator.canPop(context)) Navigator.pop(context);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error during logout: ${e.toString()}')),
        );
        Future.delayed(const Duration(seconds: 2), () {
          if (mounted) {
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(builder: (_) => const LoginScreen()),
            );
          }
        });
      }
    }
  }

  Future<void> _initializeRooms() async {
    try {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(child: CircularProgressIndicator()),
      );
      final response = await http.post(
        Uri.parse('${_apiService.baseUrl}/rooms/initialize'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      );
      if (mounted && Navigator.canPop(context)) Navigator.pop(context);
      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Rooms initialized successfully')),
        );
        await _loadRooms();
      } else {
        final errorData = json.decode(response.body);
        final errorMessage = errorData['message'] ?? 'Failed to initialize rooms';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(errorMessage)),
        );
      }
    } catch (e) {
      if (mounted && Navigator.canPop(context)) Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: ${e.toString()}')),
      );
    }
  }

  Future<bool> _toggleRoomAvailability(int roomId) async {
    try {
      bool newStatus = await _apiService.toggleRoomAvailability(roomId);
      await _loadRooms();
      return newStatus;
    } catch (e) {
      rethrow;
    }
  }

  Future<void> _updateBookingStatus(String bookingId, String status) async {
    try {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(child: CircularProgressIndicator()),
      );
      await _apiService.updateBookingStatus(bookingId, status);
      if (context.mounted) Navigator.of(context).pop();
      await _loadBookings();
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Booking status updated to $status'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (context.mounted && Navigator.canPop(context)) Navigator.of(context).pop();
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error updating booking status: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _deleteRoom(int id) async {
    try {
      await _apiService.deleteRoom(id);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Room deleted successfully')),
      );
      _loadRooms();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to delete room: ${e.toString()}')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Admin Dashboard',
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        backgroundColor: Colors.green.shade900,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _logout,
            tooltip: 'Logout',
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(icon: Icon(Icons.dashboard), text: 'Dashboard'),
            Tab(icon: Icon(Icons.people), text: 'Users'),
            Tab(icon: Icon(Icons.hotel), text: 'Rooms'),
            Tab(icon: Icon(Icons.book_online), text: 'Bookings'),
          ],
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          indicatorColor: Colors.white,
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [
                DashboardTab(
                  userData: _userData,
                  users: _users,
                  rooms: _rooms,
                  bookings: _bookings,
                  onRefresh: _loadAllData,
                  tabController: _tabController,
                ),
                UsersTab(
                  users: _users,
                  isLoading: _loadingUsers,
                  onRefresh: _loadUsers,
                  bookings: _bookings,
                ),
                RoomsTab(
                  rooms: _rooms,
                  isLoading: _loadingRooms,
                  onRefresh: _loadRooms,
                  onInitializeRooms: _initializeRooms,
                  onToggleRoomAvailability: _toggleRoomAvailability,
                  onDeleteRoom: _deleteRoom,
                  bookings: _bookings,
                ),
                BookingsTab(
                  bookings: _bookings,
                  isLoading: _loadingBookings,
                  onRefresh: _loadBookings,
                  onUpdateBookingStatus: _updateBookingStatus,
                ),
              ],
            ),
    );
  }
}