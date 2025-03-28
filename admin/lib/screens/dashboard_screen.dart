import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/web_enabled_api_service.dart';
import 'login_screen.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

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
          Icon(icon, size: 16, color: Colors.grey.shade700),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey.shade600,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
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
          backgroundColor: status == 'approved' ? Colors.green : 
                         status == 'rejected' ? Colors.red : 
                         status == 'completed' ? Colors.blue : Colors.orange,
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
          backgroundColor: Colors.red,
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
                        color: Colors.grey.shade700
                      ),
                    ),
                    const Spacer(),
                    Switch(
                      value: isAvailable,
                      onChanged: (value) {
                        isAvailable = value;
                        (context as Element).markNeedsBuild();
                      },
                      activeColor: Colors.green,
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
        backgroundColor: Colors.blue.shade900,
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
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Welcome, ${_userData?['name'] ?? 'Admin'}!',
            style: GoogleFonts.poppins(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.blue.shade900,
            ),
          ),
          const SizedBox(height: 32),
          
          // Initialize rooms button - always show this now
          ElevatedButton.icon(
            onPressed: () => _initializeRooms(),
            icon: const Icon(Icons.add_business),
            label: const Text('Initialize Hotel Rooms'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue.shade800,
              padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
          ),
          const SizedBox(height: 16),
          
          _buildDashboardCard(
            title: 'Total Users',
            value: _users.length.toString(),
            icon: Icons.people,
            color: Colors.indigo,
          ),
          const SizedBox(height: 16),
          _buildDashboardCard(
            title: 'Total Rooms',
            value: _rooms.length.toString(),
            icon: Icons.hotel,
            color: Colors.blue,
          ),
          const SizedBox(height: 16),
          _buildDashboardCard(
            title: 'Total Bookings',
            value: _bookings.length.toString(),
            icon: Icons.calendar_today,
            color: Colors.orange,
          ),
          const SizedBox(height: 16),
          _buildDashboardCard(
            title: 'Pending Bookings',
            value: _bookings.where((b) => b['status'] == 'pending').length.toString(),
            icon: Icons.pending_actions,
            color: Colors.amber,
          ),
        ],
      ),
    );
  }

  Widget _buildUsersTab() {
    if (_loadingUsers) {
      return const Center(child: CircularProgressIndicator());
    }
    
    if (_users.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.people_outline, size: 64, color: Colors.grey),
            const SizedBox(height: 16),
            Text(
              'No users found',
              style: GoogleFonts.poppins(
                fontSize: 18,
                color: Colors.grey.shade700,
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: _loadUsers,
              icon: const Icon(Icons.refresh),
              label: const Text('Reload'),
            ),
          ],
        ),
      );
    }
    
    return RefreshIndicator(
      onRefresh: _loadUsers,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _users.length,
        itemBuilder: (context, index) {
          final user = _users[index];
          return Card(
            elevation: 2,
            margin: const EdgeInsets.only(bottom: 16),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: Colors.blue.shade100,
                child: Text(
                  user['name']?.substring(0, 1).toUpperCase() ?? 'U',
                  style: TextStyle(color: Colors.blue.shade900),
                ),
              ),
              title: Text(user['name'] ?? 'Unknown'),
              subtitle: Text(user['email'] ?? 'No email'),
              trailing: Chip(
                label: Text(
                  user['role'] ?? 'user',
                  style: const TextStyle(color: Colors.white),
                ),
                backgroundColor: user['role'] == 'admin' 
                    ? Colors.purple 
                    : Colors.blue,
              ),
            ),
          );
        },
      ),
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
          
          Color statusColor;
          switch(booking['status']) {
            case 'approved':
              statusColor = Colors.green;
              break;
            case 'rejected':
              statusColor = Colors.red;
              break;
            case 'completed':
              statusColor = Colors.blue;
              break;
            case 'pending':
            default:
              statusColor = Colors.orange;
          }
          
          return Card(
            elevation: 3,
            margin: const EdgeInsets.only(bottom: 20),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Booking #${booking['id']}',
                        style: GoogleFonts.poppins(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Chip(
                        label: Text(
                          booking['status']?.toUpperCase() ?? 'PENDING',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                        backgroundColor: statusColor,
                      ),
                    ],
                  ),
                  const Divider(height: 24),
                  
                  // Room information
                  Container(
                    padding: EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.blue.shade50,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.apartment, size: 20, color: Colors.blue.shade800),
                            SizedBox(width: 8),
                            Text(
                              'Room Details', 
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: Colors.blue.shade800,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: _buildBookingInfoItem(
                                title: 'Room Number',
                                value: 'Room $roomNumber',
                                icon: Icons.hotel,
                              ),
                            ),
                            Expanded(
                              child: _buildBookingInfoItem(
                                title: 'Floor',
                                value: 'Floor $roomFloor',
                                icon: Icons.layers,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: _buildBookingInfoItem(
                                title: 'Room Type',
                                value: roomType,
                                icon: Icons.category,
                              ),
                            ),
                            Expanded(
                              child: _buildBookingInfoItem(
                                title: 'Guests',
                                value: '$guestCount person(s)',
                                icon: Icons.people,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  
                  SizedBox(height: 16),
                  
                  // Guest information
                  Container(
                    padding: EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.green.shade50,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.person, size: 20, color: Colors.green.shade800),
                            SizedBox(width: 8),
                            Text(
                              'Guest Information', 
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: Colors.green.shade800,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: _buildBookingInfoItem(
                                title: 'Guest Name',
                                value: guestName,
                                icon: Icons.person_outline,
                              ),
                            ),
                            Expanded(
                              child: _buildBookingInfoItem(
                                title: 'Phone Number',
                                value: phoneNumber,
                                icon: Icons.phone,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  
                  SizedBox(height: 16),
                  
                  // Date and Price information
                  Container(
                    padding: EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.amber.shade50,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.date_range, size: 20, color: Colors.amber.shade800),
                            SizedBox(width: 8),
                            Text(
                              'Schedule & Payment', 
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: Colors.amber.shade800,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: _buildBookingInfoItem(
                                title: 'Check In',
                                value: checkIn,
                                icon: Icons.calendar_today,
                              ),
                            ),
                            Expanded(
                              child: _buildBookingInfoItem(
                                title: 'Check Out',
                                value: checkOut,
                                icon: Icons.event_available,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: _buildBookingInfoItem(
                                title: 'Payment Method',
                                value: booking['payment_method'] ?? 'Credit Card',
                                icon: Icons.payment,
                              ),
                            ),
                            Expanded(
                              child: _buildBookingInfoItem(
                                title: 'Total Amount',
                                value: _formatCurrency(booking['total_price']),
                                icon: Icons.attach_money,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  
                  // Identity Card Display
                  if (identityCard != null)
                    Container(
                      margin: const EdgeInsets.only(top: 16),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.purple.shade50,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.card_membership, size: 20, color: Colors.purple.shade800),
                              SizedBox(width: 8),
                              Text(
                                'Identity Card', 
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                  color: Colors.purple.shade800,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          identityCard.toString().startsWith('http') ?
                            Image.network(
                              identityCard,
                              height: 150,
                              fit: BoxFit.contain,
                              errorBuilder: (context, error, stackTrace) => 
                                Text("Cannot load image: $identityCard"),
                            ) :
                            identityCard.toString().contains('identity-cards/') ?
                            Image.network(
                              '$kApiBaseUrl/storage/$identityCard',
                              height: 150,
                              fit: BoxFit.contain,
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
                        ],
                      ),
                    ),
                    
                  // Special Requests
                  if (specialRequests != null && specialRequests != '' && specialRequests != 'None')
                    Container(
                      margin: const EdgeInsets.only(top: 16),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.orange.shade50,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.note_alt, size: 20, color: Colors.orange.shade800),
                              SizedBox(width: 8),
                              Text(
                                'Special Requests', 
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                  color: Colors.orange.shade800,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
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
                  
                  const SizedBox(height: 24),
                  
                  // Action buttons
                  if (booking['status'] == 'pending')
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        ElevatedButton.icon(
                          onPressed: () => _updateBookingStatus(booking['id'], 'approved'),
                          icon: const Icon(Icons.check_circle),
                          label: const Text('Approve'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                            padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                          ),
                        ),
                        OutlinedButton.icon(
                          onPressed: () => _updateBookingStatus(booking['id'], 'rejected'),
                          icon: const Icon(Icons.cancel),
                          label: const Text('Reject'),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: Colors.red,
                            padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
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
                          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildDashboardCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                size: 32,
                color: color,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      color: Colors.grey.shade600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    value,
                    style: GoogleFonts.poppins(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.blue.shade900,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
} 