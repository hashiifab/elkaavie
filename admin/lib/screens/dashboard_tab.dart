import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../main.dart';
import '../utils.dart';

class DashboardTab extends StatelessWidget {
  final Map<String, dynamic>? userData;
  final List<dynamic> users;
  final List<dynamic> rooms;
  final List<dynamic> bookings;
  final Future<void> Function() onRefresh;
  final TabController? tabController;

  const DashboardTab({
    super.key,
    this.userData,
    required this.users,
    required this.rooms,
    required this.bookings,
    required this.onRefresh,
    this.tabController,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Welcome, ${userData?['name'] ?? 'Admin'}',
                style: GoogleFonts.poppins(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
              IconButton(
                onPressed: onRefresh,
                icon: const Icon(Icons.refresh),
                tooltip: 'Refresh data',
                color: AppColors.primary,
              ),
            ],
          ),
          const SizedBox(height: 24),
          _buildDashboardStats(context),
          const SizedBox(height: 24),
          _buildRecentBookings(context),
        ],
      ),
    );
  }

  Widget _buildDashboardStats(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      children: [
        _buildStatCard(
          context: context,
          title: 'Total Users',
          value: users.length.toString(),
          icon: Icons.people,
          color: AppColors.primary,
          tabIndex: 1, // Users tab index
        ),
        _buildStatCard(
          context: context,
          title: 'Total Rooms',
          value: rooms.length.toString(),
          icon: Icons.hotel,
          color: AppColors.secondary,
          tabIndex: 2, // Rooms tab index
        ),
        _buildStatCard(
          context: context,
          title: 'Total Bookings',
          value: bookings.length.toString(),
          icon: Icons.book_online,
          color: AppColors.accent,
          tabIndex: 3, // Bookings tab index
        ),
        _buildStatCard(
          context: context,
          title: 'Pending Bookings',
          value: bookings.where((b) => b['status'] == 'pending').length.toString(),
          icon: Icons.pending_actions,
          color: AppColors.warning,
          tabIndex: 3, // Bookings tab index
          filter: 'pending', // Filter to pending bookings
        ),
      ],
    );
  }

  Widget _buildStatCard({
    required BuildContext context,
    required String title,
    required String value,
    required IconData icon,
    required Color color,
    required int tabIndex,
    String? filter,
  }) {
    return InkWell(
      onTap: () {
        if (tabController != null) {
          tabController!.animateTo(tabIndex);
          
          // Pass filter information through a callback or other mechanism if needed
          if (filter != null && tabIndex == 3) {
            // This is a potential hook for the Bookings tab to know it should filter
            // In a real implementation, you might use a state management solution
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Showing $filter bookings'),
                duration: const Duration(seconds: 1),
              ),
            );
          }
        }
      },
      borderRadius: BorderRadius.circular(12),
      child: Card(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 40, color: color),
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
              const SizedBox(height: 4),
              Icon(
                Icons.touch_app,
                size: 16,
                color: color.withOpacity(0.5),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRecentBookings(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Recent Bookings',
              style: GoogleFonts.poppins(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            if (bookings.isNotEmpty) 
              TextButton(
                onPressed: () {
                  if (tabController != null) {
                    tabController!.animateTo(3); // Navigate to bookings tab
                  }
                },
                child: Row(
                  children: [
                    Text(
                      'View All',
                      style: GoogleFonts.poppins(
                        color: AppColors.primary,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Icon(Icons.arrow_forward, size: 16, color: AppColors.primary),
                  ],
                ),
              ),
          ],
        ),
        const SizedBox(height: 16),
        bookings.isEmpty
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
                itemCount: bookings.length > 5 ? 5 : bookings.length,
                itemBuilder: (context, index) {
                  final booking = bookings[index];
                  final checkIn = booking['check_in'] != null
                      ? DateFormat('dd MMM yyyy').format(DateTime.parse(booking['check_in']))
                      : 'N/A';
                  final checkOut = booking['check_out'] != null
                      ? DateFormat('dd MMM yyyy').format(DateTime.parse(booking['check_out']))
                      : 'N/A';
                  final roomNumber = booking['room']?['number'] ?? 'Unknown';
                  final guestName = booking['user']?['name'] ?? 'Guest';

                  return InkWell(
                    onTap: () {
                      if (tabController != null) {
                        tabController!.animateTo(3); // Navigate to bookings tab
                      }
                    },
                    borderRadius: BorderRadius.circular(12),
                    child: Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.all(16),
                        leading: CircleAvatar(
                          backgroundColor: AppColors.primary.withOpacity(0.1),
                          child: Icon(Icons.hotel, color: AppColors.primary),
                        ),
                        title: Text(
                          'Room $roomNumber',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text('$guestName - $checkIn to $checkOut'),
                        trailing: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: getStatusColor(booking['status']).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            booking['status']?.toUpperCase() ?? 'UNKNOWN',
                            style: TextStyle(
                              color: getStatusColor(booking['status']),
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
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