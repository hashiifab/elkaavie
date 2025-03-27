import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/web_enabled_api_service.dart';
import 'login_screen.dart';
import 'package:intl/intl.dart';

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
    try {
      await _apiService.logout();
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const LoginScreen()),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }
  
  // Helper to format currency
  String _formatCurrency(dynamic price) {
    if (price == null) return 'Rp 0';
    final formatter = NumberFormat.currency(
      locale: 'id',
      symbol: 'Rp ',
      decimalDigits: 0,
    );
    return formatter.format(price is int ? price : int.tryParse(price.toString()) ?? 0);
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
    try {
      await _apiService.updateBooking(id, {'status': status});
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Booking status updated to $status')),
      );
      _loadBookings();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to update booking: ${e.toString()}')),
      );
    }
  }
  
  Future<void> _showRoomDialog({Map<String, dynamic>? room}) async {
    final formKey = GlobalKey<FormState>();
    final nameController = TextEditingController(text: room?['name']);
    final typeController = TextEditingController(text: room?['type']);
    final priceController = TextEditingController(
        text: room?['price']?.toString());
    final capacityController = TextEditingController(
        text: room?['capacity']?.toString());
    final descriptionController = TextEditingController(text: room?['description']);
    bool isAvailable = room?['is_available'] ?? true;
    String? imageUrl = room?['image_url'];
    
    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(room == null ? 'Add Room' : 'Edit Room'),
        content: Form(
          key: formKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextFormField(
                  controller: nameController,
                  decoration: const InputDecoration(labelText: 'Room Name'),
                  validator: (value) => value?.isEmpty ?? true 
                      ? 'Please enter room name' : null,
                ),
                TextFormField(
                  controller: typeController,
                  decoration: const InputDecoration(labelText: 'Room Type'),
                  validator: (value) => value?.isEmpty ?? true 
                      ? 'Please enter room type' : null,
                ),
                TextFormField(
                  controller: priceController,
                  decoration: const InputDecoration(labelText: 'Price'),
                  keyboardType: TextInputType.number,
                  validator: (value) => value?.isEmpty ?? true 
                      ? 'Please enter price' : null,
                ),
                TextFormField(
                  controller: capacityController,
                  decoration: const InputDecoration(labelText: 'Capacity'),
                  keyboardType: TextInputType.number,
                  validator: (value) => value?.isEmpty ?? true 
                      ? 'Please enter capacity' : null,
                ),
                TextFormField(
                  controller: descriptionController,
                  decoration: const InputDecoration(labelText: 'Description'),
                  maxLines: 3,
                  validator: (value) => value?.isEmpty ?? true 
                      ? 'Please enter description' : null,
                ),
                if (imageUrl != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 12.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Current Image:', style: TextStyle(
                          color: Colors.grey.shade700,
                          fontSize: 12,
                        )),
                        const SizedBox(height: 4),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.network(
                            imageUrl,
                            height: 100,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) => 
                              Container(
                                height: 100,
                                color: Colors.grey.shade200,
                                child: const Center(child: Text('Image not available')),
                              ),
                          ),
                        ),
                      ],
                    ),
                  ),
                const SizedBox(height: 16),
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
                final roomData = {
                  'name': nameController.text,
                  'type': typeController.text,
                  'price': int.parse(priceController.text),
                  'capacity': int.parse(capacityController.text),
                  'description': descriptionController.text,
                  'is_available': isAvailable,
                };
                
                try {
                  if (room == null) {
                    await _apiService.createRoom(roomData);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Room added successfully')),
                    );
                  } else {
                    await _apiService.updateRoom(room['id'], roomData);
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
            child: Text(room == null ? 'Add' : 'Update'),
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
      floatingActionButton: _tabController.index == 2 ? 
        FloatingActionButton(
          onPressed: () => _showRoomDialog(),
          child: const Icon(Icons.add),
        ) : null,
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
              onPressed: _loadRooms,
              icon: const Icon(Icons.refresh),
              label: const Text('Reload'),
            ),
          ],
        ),
      );
    }
    
    return RefreshIndicator(
      onRefresh: _loadRooms,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _rooms.length,
        itemBuilder: (context, index) {
          final room = _rooms[index];
          final bool isAvailable = room['is_available'] ?? true;
          
          return Card(
            elevation: 2,
            margin: const EdgeInsets.only(bottom: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (room['image_url'] != null)
                  Stack(
                    children: [
                      Image.network(
                        room['image_url'],
                        height: 200,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            height: 120,
                            color: Colors.grey.shade200,
                            child: const Icon(Icons.image_not_supported, size: 64),
                          );
                        },
                      ),
                      Positioned(
                        top: 10,
                        right: 10,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: isAvailable ? Colors.green : Colors.red,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            isAvailable ? 'Available' : 'Unavailable',
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ],
                  )
                else
                  Container(
                    height: 40,
                    width: double.infinity,
                    alignment: Alignment.centerRight,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: isAvailable ? Colors.green : Colors.red,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        isAvailable ? 'Available' : 'Unavailable',
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              room['name'] ?? 'Unnamed Room',
                              style: GoogleFonts.poppins(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          Text(
                            _formatCurrency(room['price']),
                            style: GoogleFonts.poppins(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Colors.blue.shade800,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Chip(
                            label: Text(room['type'] ?? 'Standard'),
                            backgroundColor: Colors.blue.shade100,
                            labelStyle: TextStyle(color: Colors.blue.shade900),
                          ),
                          const SizedBox(width: 8),
                          Chip(
                            label: Text('${room['capacity'] ?? 2} Person'),
                            backgroundColor: Colors.green.shade100,
                            labelStyle: TextStyle(color: Colors.green.shade900),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        room['description'] ?? 'No description available',
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          color: Colors.grey.shade700,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: () async {
                                try {
                                  await _apiService.updateRoom(room['id'], {
                                    'is_available': !isAvailable,
                                  });
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text(
                                      'Room marked as ${!isAvailable ? 'available' : 'unavailable'}'
                                    )),
                                  );
                                  _loadRooms();
                                } catch (e) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text(e.toString())),
                                  );
                                }
                              },
                              icon: Icon(isAvailable ? Icons.do_not_disturb_alt : Icons.check_circle),
                              label: Text(isAvailable ? 'Mark Unavailable' : 'Mark Available'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: isAvailable ? Colors.red.shade300 : Colors.green,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          OutlinedButton.icon(
                            onPressed: () => _showRoomDialog(room: room),
                            icon: const Icon(Icons.edit),
                            label: const Text('Edit'),
                          ),
                          const SizedBox(width: 8),
                          ElevatedButton.icon(
                            onPressed: () => showDialog(
                              context: context,
                              builder: (context) => AlertDialog(
                                title: const Text('Confirm Delete'),
                                content: Text('Are you sure you want to delete ${room['name']}?'),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.pop(context),
                                    child: const Text('Cancel'),
                                  ),
                                  ElevatedButton(
                                    onPressed: () {
                                      Navigator.pop(context);
                                      _deleteRoom(room['id']);
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.red,
                                    ),
                                    child: const Text('Delete'),
                                  ),
                                ],
                              ),
                            ),
                            icon: const Icon(Icons.delete),
                            label: const Text('Delete'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red,
                            ),
                          ),
                        ],
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

  Widget _buildBookingsTab() {
    if (_loadingBookings) {
      return const Center(child: CircularProgressIndicator());
    }
    
    if (_bookings.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.book_online_outlined, size: 64, color: Colors.grey),
            const SizedBox(height: 16),
            Text(
              'No bookings found',
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
        itemCount: _bookings.length,
        itemBuilder: (context, index) {
          final booking = _bookings[index];
          final checkIn = booking['check_in'] != null 
              ? DateFormat('dd MMM yyyy').format(DateTime.parse(booking['check_in']))
              : 'N/A';
          final checkOut = booking['check_out'] != null 
              ? DateFormat('dd MMM yyyy').format(DateTime.parse(booking['check_out']))
              : 'N/A';
          
          Color statusColor;
          switch(booking['status']) {
            case 'confirmed':
              statusColor = Colors.green;
              break;
            case 'cancelled':
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
            elevation: 2,
            margin: const EdgeInsets.only(bottom: 16),
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
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Chip(
                        label: Text(
                          booking['status']?.toUpperCase() ?? 'PENDING',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        backgroundColor: statusColor,
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _buildBookingInfoItem(
                          title: 'Room',
                          value: booking['room']?['name'] ?? 'Unknown',
                          icon: Icons.hotel,
                        ),
                      ),
                      Expanded(
                        child: _buildBookingInfoItem(
                          title: 'Guest',
                          value: booking['user']?['name'] ?? 'Unknown',
                          icon: Icons.person,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
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
                  const SizedBox(height: 12),
                  _buildBookingInfoItem(
                    title: 'Total Amount',
                    value: _formatCurrency(booking['total_price']),
                    icon: Icons.attach_money,
                  ),
                  const SizedBox(height: 16),
                  if (booking['status'] == 'pending')
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        ElevatedButton.icon(
                          onPressed: () => _updateBookingStatus(booking['id'], 'confirmed'),
                          icon: const Icon(Icons.check_circle),
                          label: const Text('Confirm'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                          ),
                        ),
                        OutlinedButton.icon(
                          onPressed: () => _updateBookingStatus(booking['id'], 'cancelled'),
                          icon: const Icon(Icons.cancel),
                          label: const Text('Cancel'),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: Colors.red,
                          ),
                        ),
                      ],
                    ),
                  if (booking['status'] == 'confirmed')
                    Center(
                      child: ElevatedButton.icon(
                        onPressed: () => _updateBookingStatus(booking['id'], 'completed'),
                        icon: const Icon(Icons.done_all),
                        label: const Text('Mark as Completed'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
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
  
  Widget _buildBookingInfoItem({
    required String title,
    required String value,
    required IconData icon,
  }) {
    return Row(
      children: [
        Icon(icon, size: 18, color: Colors.blue.shade700),
        const SizedBox(width: 8),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey.shade600,
              ),
            ),
            Text(
              value,
              style: GoogleFonts.poppins(
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ],
    );
  }
} 