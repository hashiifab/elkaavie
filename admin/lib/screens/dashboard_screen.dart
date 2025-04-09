import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/web_enabled_api_service.dart';
import 'login_screen.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../main.dart'; // Import the AppColors class

// API base URL
const String kApiBaseUrl = 'http://localhost:8000';

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
    if (mounted) {
      setState(() {
        _loadingUsers = true;
      });
    }
    
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
        setState(() {
          _loadingUsers = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load users: ${e.toString()}')),
        );
      }
    }
  }
  
  Future<void> _loadRooms() async {
    if (mounted) {
      setState(() {
        _loadingRooms = true;
      });
    }
    
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
        setState(() {
          _loadingRooms = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load rooms: ${e.toString()}')),
        );
      }
    }
  }
  
  Future<void> _loadBookings() async {
    if (mounted) {
      setState(() {
        _loadingBookings = true;
      });
    }
    
    try {
      final bookings = await _apiService.getBookings();
      if (mounted) {
        setState(() {
          _bookings = bookings;
          _loadingBookings = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _loadingBookings = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load bookings: ${e.toString()}')),
        );
      }
    }
  }

  Future<void> _logout() async {
    // Show loading indicator
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(
        child: CircularProgressIndicator(),
      ),
    );
    
    try {
      await _apiService.logout();
      
      // Close the loading indicator and navigate to login
      if (mounted) {
        Navigator.pop(context); // Close loading dialog
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const LoginScreen()),
        );
      }
    } catch (e) {
      // Close loading indicator
      if (mounted && Navigator.canPop(context)) {
        Navigator.pop(context);
      }
      
      // Still show the error but force navigation to login screen
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error during logout: ${e.toString()}')),
        );
        
        // Navigate to login anyway since token is cleared
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
  
  String _formatCurrency(dynamic price) {
    if (price == null) return 'Rp 0';
    
    try {
      // Try to parse the price as a number
      double numPrice = double.parse(price.toString());
      // Format with thousand separators
      final formatter = NumberFormat.currency(
        locale: 'id_ID',
        symbol: 'Rp ',
        decimalDigits: 0,
      );
      return formatter.format(numPrice);
    } catch (e) {
      // If parsing fails, return the original with Rp prefix
      return 'Rp $price';
    }
  }
  
  Widget _buildBookingInfoItem({
    required String title,
    required String value,
    required IconData icon,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 16, color: AppColors.textSecondary),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
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
  
  Future<void> _updateBookingStatus(int id, String status) async {
    // Show loading dialog
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(
        child: CircularProgressIndicator(),
      ),
    );
    
    try {
      print('Attempting to update booking status...');
      final response = await _apiService.updateBookingStatus(id, status);
      print('Update response received: $response');
      
      // Close loading dialog
      if (mounted && Navigator.canPop(context)) {
        Navigator.pop(context);
      }
      
      // Show success message
      String message = 'Booking ';
      if (status == 'approved') {
        message += 'approved successfully';
      } else if (status == 'rejected') {
        message += 'rejected successfully';
      } else if (status == 'completed') {
        message += 'marked as completed';
      } else if (status == 'cancelled') {
        message += 'cancelled successfully';
      } else {
        message += 'status updated to $status';
      }
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(message),
          backgroundColor: status == 'approved' ? AppColors.success : 
                         status == 'rejected' ? AppColors.error : 
                         status == 'completed' ? AppColors.info : AppColors.warning,
        ),
      );
      
      // Reload bookings
      await _loadBookings();
    } catch (e) {
      print('Error updating booking status: $e');
      
      // Close loading dialog
      if (mounted && Navigator.canPop(context)) {
        Navigator.pop(context);
      }
      
      // Show error message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: ${e.toString()}'),
          backgroundColor: AppColors.error,
          duration: const Duration(seconds: 5),
        ),
      );
    }
  }
  
  Future<void> _showRoomDialog({Map<String, dynamic>? room}) async {
    final formKey = GlobalKey<FormState>();
    final priceController = TextEditingController(
        text: (room?['roomType']?['price'] ?? 500000).toString());
    bool isAvailable = room?['is_available'] ?? true;
    
    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(room == null ? 'Room Details' : 'Edit Room'),
        content: Form(
          key: formKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Room info (non-editable)
                if (room != null) ...[
                  ListTile(
                    title: Text('Room Number'),
                    subtitle: Text(room['number'] ?? ''),
                    leading: Icon(Icons.hotel),
                    dense: true,
                  ),
                  ListTile(
                    title: Text('Floor'),
                    subtitle: Text('Floor ${room['floor'] ?? ''}'),
                    leading: Icon(Icons.layers),
                    dense: true,
                  ),
                  ListTile(
                    title: Text('Type'),
                    subtitle: Text(room['roomType']?['name'] ?? 'Standard'),
                    leading: Icon(Icons.category),
                    dense: true,
                  ),
                  SizedBox(height: 16),
                  Divider(),
                  SizedBox(height: 16),
                ],
                
                // Price field - editable
                TextFormField(
                  controller: priceController,
                  decoration: const InputDecoration(
                    labelText: 'Price per Night', 
                    prefixText: 'Rp ',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.number,
                  validator: (value) => value?.isEmpty ?? true 
                      ? 'Please enter price' : null,
                ),
                
                SizedBox(height: 16),
                
                // Available toggle
                Row(
                  children: [
                    Text(
                      'Available:', 
                      style: TextStyle(
                        fontSize: 16, 
                        color: AppColors.textSecondary
                      ),
                    ),
                    const Spacer(),
                    Switch(
                      value: isAvailable,
                      onChanged: (value) {
                        isAvailable = value;
                        (context as Element).markNeedsBuild();
                      },
                      activeColor: AppColors.success,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              if (formKey.currentState?.validate() ?? false) {
                try {
                  if (room != null) {
                    // Update price if changed
                    final newPrice = int.parse(priceController.text);
                    if (newPrice != room['roomType']['price']) {
                      await _apiService.updateRoomPrice(room['id'], newPrice);
                    }
                    
                    // Update availability if changed
                    if (isAvailable != room['is_available']) {
                      await _apiService.toggleRoomAvailability(room['id']);
                    }
                    
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Room updated successfully')),
                    );
                  }
                  _loadRooms();
                  Navigator.pop(context);
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(e.toString())),
                  );
                }
              }
            },
            child: Text('Save'),
          ),
        ],
      ),
    );
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
        backgroundColor: AppColors.primary,
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
                _buildDashboardTab(),
                _buildUsersTab(),
                _buildRoomsTab(),
                _buildBookingsTab(),
              ],
            ),
    );
  }

  Widget _buildDashboardTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Welcome, ${_userData?['name'] ?? 'Admin'}',
            style: GoogleFonts.poppins(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: AppColors.primary,
            ),
          ),
          const SizedBox(height: 24),
          _buildDashboardStats(),
          const SizedBox(height: 24),
          _buildRecentBookings(),
        ],
      ),
    );
  }

  Widget _buildDashboardStats() {
    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      children: [
        _buildStatCard(
          title: 'Total Users',
          value: _users.length.toString(),
          icon: Icons.people,
          color: AppColors.primary,
        ),
        _buildStatCard(
          title: 'Total Rooms',
          value: _rooms.length.toString(),
          icon: Icons.hotel,
          color: AppColors.secondary,
        ),
        _buildStatCard(
          title: 'Total Bookings',
          value: _bookings.length.toString(),
          icon: Icons.book_online,
          color: AppColors.accent,
        ),
        _buildStatCard(
          title: 'Pending Bookings',
          value: _bookings.where((b) => b['status'] == 'pending').length.toString(),
          icon: Icons.pending_actions,
          color: AppColors.warning,
        ),
      ],
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 40,
              color: color,
            ),
            const SizedBox(height: 12),
            Text(
              value,
              style: GoogleFonts.poppins(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: GoogleFonts.poppins(
                fontSize: 14,
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUsersTab() {
    return _loadingUsers
        ? const Center(child: CircularProgressIndicator())
        : _users.isEmpty
            ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.people_outline,
                      size: 64,
                      color: AppColors.textSecondary,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'No users found',
                      style: TextStyle(
                        fontSize: 18,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              )
            : ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _users.length,
                itemBuilder: (context, index) {
                  final user = _users[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: ListTile(
                      contentPadding: const EdgeInsets.all(16),
                      leading: CircleAvatar(
                        backgroundColor: AppColors.primary,
                        child: Text(
                          user['name']?[0]?.toUpperCase() ?? 'U',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      title: Text(
                        user['name'] ?? 'Unknown',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      subtitle: Text(user['email'] ?? 'No email'),
                      trailing: Chip(
                        label: Text(
                          user['role'] ?? 'user',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                          ),
                        ),
                        backgroundColor: user['role'] == 'admin'
                            ? AppColors.primary
                            : AppColors.secondary,
                      ),
                    ),
                  );
                },
              );
  }

  Widget _buildRoomsTab() {
    if (_loadingRooms) {
      return const Center(child: CircularProgressIndicator());
    }
    
    if (_rooms.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.hotel_outlined, size: 64, color: Colors.grey),
            const SizedBox(height: 16),
            Text(
              'No rooms found',
              style: GoogleFonts.poppins(
                fontSize: 18,
                color: Colors.grey.shade700,
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: _initializeRooms,
              icon: const Icon(Icons.add_business),
              label: const Text('Initialize Hotel Rooms'),
            ),
          ],
        ),
      );
    }
    
    // Group rooms by floor
    Map<int, List<dynamic>> roomsByFloor = {};
    for (var room in _rooms) {
      int floor = room['floor'] ?? 0;
      if (!roomsByFloor.containsKey(floor)) {
        roomsByFloor[floor] = [];
      }
      roomsByFloor[floor]!.add(room);
    }
    
    // Sort floors
    List<int> sortedFloors = roomsByFloor.keys.toList()..sort();
    
    return RefreshIndicator(
      onRefresh: _loadRooms,
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header with legend
            Container(
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _buildLegendItem(Colors.green, 'Available'),
                  const SizedBox(width: 24),
                  _buildLegendItem(Colors.red, 'Unavailable'),
                ],
              ),
            ),
            const SizedBox(height: 24),
            
            // Each floor
            for (int floor in sortedFloors) ...[
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.blue.shade900,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  'Floor $floor',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              
              // Rooms in a grid that looks like cinema seats
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  children: [
                    // Hallway label
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        'Hallway',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey.shade700),
                      ),
                    ),
                    
                    // Room grid
                    GridView.builder(
                      physics: const NeverScrollableScrollPhysics(),
                      shrinkWrap: true,
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 5,
                        childAspectRatio: 2.0,
                        crossAxisSpacing: 10,
                        mainAxisSpacing: 10,
                      ),
                      itemCount: roomsByFloor[floor]!.length,
                      itemBuilder: (context, index) {
                        final room = roomsByFloor[floor]![index];
                        final bool isAvailable = room['is_available'] ?? true;
                        final String roomNumber = room['number'] ?? '';
                        
                        return GestureDetector(
                          onTap: () async {
                            try {
                              bool newStatus = await _apiService.toggleRoomAvailability(room['id']);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Room marked as ${newStatus ? 'available' : 'unavailable'}')),
                              );
                              _loadRooms();
                            } catch (e) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text(e.toString())),
                              );
                            }
                          },
                          child: Container(
                            decoration: BoxDecoration(
                              color: isAvailable ? Colors.green : Colors.red,
                              borderRadius: BorderRadius.circular(8),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.1),
                                  blurRadius: 4,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Center(
                              child: Text(
                                'Room ${roomNumber}',
                                style: GoogleFonts.poppins(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildLegendItem(Color color, String label) {
    return Row(
      children: [
        Container(
          width: 18,
          height: 18,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(4),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          label,
          style: TextStyle(fontWeight: FontWeight.w500),
        ),
      ],
    );
  }
  
  // Separate function for room initialization with simple error handling
  Future<void> _initializeRooms() async {
    try {
      // Show loading indicator
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(
          child: CircularProgressIndicator(),
        ),
      );
      
      // Direct HTTP request without going through the service
      final response = await http.post(
        Uri.parse('http://localhost:8000/api/rooms/initialize'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      );
      
      // Close loading dialog
      if (mounted && Navigator.canPop(context)) {
        Navigator.pop(context);
      }
      
      if (response.statusCode == 200) {
        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Rooms initialized successfully')),
        );
        
        // Reload rooms data
        await _loadRooms();
      } else {
        // Show error message
        final errorData = json.decode(response.body);
        final errorMessage = errorData['message'] ?? 'Failed to initialize rooms';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(errorMessage)),
        );
      }
    } catch (e) {
      // Close loading dialog if still showing
      if (mounted && Navigator.canPop(context)) {
        Navigator.pop(context);
      }
      
      // Show error
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: ${e.toString()}')),
      );
    }
  }

  Widget _buildBookingsTab() {
    if (_loadingBookings) {
      return const Center(child: CircularProgressIndicator());
    }
    
    // Filter out bookings without real users
    final validBookings = _bookings.where((booking) => 
      booking['user'] != null && 
      booking['user']['id'] != null && 
      booking['user']['name'] != null
    ).toList();
    
    if (validBookings.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.book_online_outlined, size: 64, color: Colors.grey),
            const SizedBox(height: 16),
            Text(
              'No valid bookings found',
              style: GoogleFonts.poppins(
                fontSize: 18,
                color: Colors.grey.shade700,
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: _loadBookings,
              icon: const Icon(Icons.refresh),
              label: const Text('Reload'),
            ),
          ],
        ),
      );
    }
    
    return RefreshIndicator(
      onRefresh: _loadBookings,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: validBookings.length,
        itemBuilder: (context, index) {
          final booking = validBookings[index];
          final checkIn = booking['check_in'] != null 
              ? DateFormat('dd MMM yyyy').format(DateTime.parse(booking['check_in']))
              : 'N/A';
          final checkOut = booking['check_out'] != null 
              ? DateFormat('dd MMM yyyy').format(DateTime.parse(booking['check_out']))
              : 'N/A';
          
          // Default values if data is missing
          final roomNumber = booking['room']?['number'] ?? booking['room_number'] ?? 'Unknown';
          final roomFloor = booking['room']?['floor'] ?? booking['room_floor'] ?? 'Unknown';
          final roomType = booking['room']?['roomType']?['name'] ?? booking['room_type'] ?? 'Standard';
          final guestName = booking['user']?['name'] ?? 'Guest';
          final phoneNumber = booking['phone_number'] ?? 'N/A';
          final guestCount = booking['guests']?.toString() ?? '1';
          final identityCard = booking['identity_card'] ?? booking['identity_card_url'];
          final specialRequests = booking['special_requests'] ?? 'None';
          
          Color statusColor = _getStatusColor(booking['status']);
          
          return Card(
            elevation: 3,
            margin: const EdgeInsets.only(bottom: 20),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                // Header with booking ID and status
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.1),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(12),
                      topRight: Radius.circular(12),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Row(
                          children: [
                            Icon(Icons.confirmation_number, color: statusColor),
                            const SizedBox(width: 8),
                            Flexible(
                              child: Text(
                                'Booking #${booking['id']}',
                                style: GoogleFonts.poppins(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: statusColor,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: statusColor,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          booking['status']?.toUpperCase() ?? 'PENDING',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                
                // Main content
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Room and Guest Info
                      _buildInfoSection(
                        icon: Icons.hotel,
                        title: 'Room Information',
                        color: Colors.blue,
                        children: [
                          _buildInfoRow('Room Number', 'Room $roomNumber'),
                          _buildInfoRow('Floor', 'Floor $roomFloor'),
                          _buildInfoRow('Type', roomType),
                        ],
                      ),
                      
                      const SizedBox(height: 16),
                      
                      _buildInfoSection(
                        icon: Icons.person,
                        title: 'Guest Information',
                        color: Colors.green,
                        children: [
                          _buildInfoRow('Name', guestName),
                          _buildInfoRow('Phone', phoneNumber),
                          _buildInfoRow('Guests', '$guestCount person(s)'),
                        ],
                      ),
                      
                      const SizedBox(height: 16),
                      
                      // Dates and Payment Info
                      _buildInfoSection(
                        icon: Icons.calendar_today,
                        title: 'Booking Details',
                        color: Colors.orange,
                        children: [
                          _buildInfoRow('Check In', checkIn),
                          _buildInfoRow('Check Out', checkOut),
                          _buildInfoRow('Payment Method', booking['payment_method'] ?? 'Credit Card'),
                          _buildInfoRow('Total Amount', _formatCurrency(booking['total_price'])),
                        ],
                      ),
                      
                      // Special Requests if any
                      if (specialRequests != null && specialRequests != '' && specialRequests != 'None')
                        Padding(
                          padding: const EdgeInsets.only(top: 16),
                          child: _buildInfoSection(
                            icon: Icons.note_alt,
                            title: 'Special Requests',
                            color: Colors.purple,
                            children: [
                              Text(
                                specialRequests,
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey.shade700,
                                ),
                              ),
                            ],
                          ),
                        ),
                      
                      // Identity Card if available
                      if (identityCard != null)
                        Padding(
                          padding: const EdgeInsets.only(top: 16),
                          child: _buildInfoSection(
                            icon: Icons.card_membership,
                            title: 'Identity Card',
                            color: Colors.indigo,
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: identityCard.toString().startsWith('http') ?
                                  Image.network(
                                    identityCard,
                                    height: 150,
                                    width: double.infinity,
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, error, stackTrace) => 
                                      Text("Cannot load image: $identityCard"),
                                  ) :
                                  identityCard.toString().contains('identity-cards/') ?
                                  Image.network(
                                    '$kApiBaseUrl/storage/$identityCard',
                                    height: 150,
                                    width: double.infinity,
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, error, stackTrace) => 
                                      Text("Cannot load image: $identityCard"),
                                  ) :
                                  Text(
                                    '$identityCard',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey.shade600,
                                    ),
                                  ),
                              ),
                            ],
                          ),
                        ),
                      
                      const SizedBox(height: 24),
                      
                      // Action Buttons
                      if (booking['status'] == 'pending')
                        Row(
                          children: [
                            Expanded(
                              child: ElevatedButton.icon(
                                onPressed: () => _updateBookingStatus(booking['id'], 'approved'),
                                icon: const Icon(Icons.check_circle),
                                label: const Text('Approve'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.green,
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: OutlinedButton.icon(
                                onPressed: () => _updateBookingStatus(booking['id'], 'rejected'),
                                icon: const Icon(Icons.cancel),
                                label: const Text('Reject'),
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: Colors.red,
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      if (booking['status'] == 'approved')
                        Center(
                          child: ElevatedButton.icon(
                            onPressed: () => _updateBookingStatus(booking['id'], 'completed'),
                            icon: const Icon(Icons.done_all),
                            label: const Text('Mark as Completed'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 24,
                                vertical: 12,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildInfoSection({
    required IconData icon,
    required String title,
    required Color color,
    required List<Widget> children,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: color.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 20, color: color),
              const SizedBox(width: 8),
              Text(
                title,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  color: color,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ...children,
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey.shade600,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  // Update the status badge colors
  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'approved':
        return AppColors.success;
      case 'pending':
        return AppColors.warning;
      case 'rejected':
      case 'cancelled':
        return AppColors.error;
      case 'completed':
        return AppColors.info;
      default:
        return AppColors.textSecondary;
    }
  }

  Widget _buildRecentBookings() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Recent Bookings',
          style: GoogleFonts.poppins(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 16),
        _bookings.isEmpty
            ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.book_online_outlined,
                      size: 64,
                      color: AppColors.textSecondary,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'No bookings found',
                      style: TextStyle(
                        fontSize: 18,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              )
            : ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _bookings.length > 5 ? 5 : _bookings.length,
                itemBuilder: (context, index) {
                  final booking = _bookings[index];
                  final checkIn = booking['check_in'] != null 
                      ? DateFormat('dd MMM yyyy').format(DateTime.parse(booking['check_in']))
                      : 'N/A';
                  final checkOut = booking['check_out'] != null 
                      ? DateFormat('dd MMM yyyy').format(DateTime.parse(booking['check_out']))
                      : 'N/A';
                  final roomNumber = booking['room']?['number'] ?? 'Unknown';
                  final guestName = booking['user']?['name'] ?? 'Guest';
                  
                  return Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: ListTile(
                      contentPadding: const EdgeInsets.all(16),
                      leading: CircleAvatar(
                        backgroundColor: AppColors.primary.withOpacity(0.1),
                        child: Icon(
                          Icons.hotel,
                          color: AppColors.primary,
                        ),
                      ),
                      title: Text(
                        'Room $roomNumber',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      subtitle: Text(
                        '$guestName - $checkIn to $checkOut',
                      ),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: _getStatusColor(booking['status']).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          booking['status']?.toUpperCase() ?? 'UNKNOWN',
                          style: TextStyle(
                            color: _getStatusColor(booking['status']),
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
      ],
    );
  }
} 