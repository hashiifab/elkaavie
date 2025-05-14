import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../utils.dart';
import '../utils/ui_components.dart';
import '../main.dart';

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
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Dashboard',
                    style: GoogleFonts.poppins(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: Colors.black.withOpacity(0.6), // Darker text
                    ),
                  ),
                  SizedBox(height: 6),
                  Text(
                    'Welcome, ${userData?['name'] ?? 'Admin'}',
                    style: GoogleFonts.poppins(
                      fontSize: 24,
                      fontWeight: FontWeight.w600,
                      color: Colors.black, // Black text for better contrast
                    ),
                  ),
                ],
              ),
              AdminRefreshButton.refreshButton(
                onPressed: onRefresh,
                backgroundColor: AppColors.success,
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
          color: Colors.blueAccent, // Changed to blue
          tabIndex: 1, // Users tab index
        ),
        _buildStatCard(
          context: context,
          title: 'Total Rooms',
          value: rooms.length.toString(),
          icon: Icons.hotel,
          color: Colors.orangeAccent, // Changed to orange
          tabIndex: 2, // Rooms tab index
        ),
        _buildStatCard(
          context: context,
          title: 'Total Bookings',
          value: bookings.length.toString(),
          icon: Icons.book_online,
          color: Colors.greenAccent, // Changed to green
          tabIndex: 3, // Bookings tab index
        ),
        _buildStatCard(
          context: context,
          title: 'Pending Bookings',
          value:
              bookings.where((b) => b['status'] == 'pending').length.toString(),
          icon: Icons.pending_actions,
          color: Colors.amberAccent, // Changed to amber
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
          if (filter != null && tabIndex == 3) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Showing $filter bookings'),
                duration: const Duration(seconds: 1),
              ),
            );
          }
        }
      },
      borderRadius: BorderRadius.circular(16), // Slightly rounded corners
      child: AnimatedContainer(
        duration: Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        decoration: BoxDecoration(
          color: Colors.white, // Clean white background
          borderRadius: BorderRadius.circular(16), // Rounded corners
          boxShadow: [
            BoxShadow(
              color: Colors.black12, // Light shadow for subtle depth
              blurRadius: 8,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Center(
                child: Text(
                  title,
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.black.withOpacity(0.7), // Darker text for better contrast
                  ),
                ),
              ),
              Center(
                child: Text(
                  value,
                  style: GoogleFonts.poppins(
                    fontWeight: FontWeight.bold,
                    fontSize: 22,
                    color: Colors.black, // Black text for better readability
                  ),
                ),
              ),
              Center(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    AnimatedScale(
                      duration: Duration(milliseconds: 200),
                      scale: 1.1, // Slightly larger on tap for animation effect
                      child: Container(
                        padding: EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: color.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(icon, size: 24, color: color),
                      ),
                    ),
                    const SizedBox(width: 12),
                    AnimatedScale(
                      duration: Duration(milliseconds: 200),
                      scale: 1.1, // Slightly enlarge the chevron icon as well
                      child: Icon(
                        Icons.chevron_right,
                        size: 24,
                        color: Colors.black.withOpacity(0.6), // Darker chevron icon
                      ),
                    ),
                  ],
                ),
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
                color: Colors.black,
              ),
            ),
            if (bookings.isNotEmpty)
              TextButton(
                style: TextButton.styleFrom(
                  foregroundColor: Colors.black,
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  textStyle: GoogleFonts.poppins(fontSize: 14),
                ),
                onPressed: () => tabController?.animateTo(3),
                child: Row(
                  children: const [
                    Text('View All'),
                    SizedBox(width: 4),
                    Icon(Icons.arrow_forward_ios, size: 14),
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
                      color: Colors.black.withOpacity(0.2),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'No bookings found',
                      style: TextStyle(
                        fontSize: 18,
                        color: Colors.black.withOpacity(0.6),
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
                  final checkIn =
                      booking['check_in'] != null
                          ? DateFormat(
                              'dd MMM yyyy',
                            ).format(DateTime.parse(booking['check_in']))
                          : 'N/A';
                  final checkOut =
                      booking['check_out'] != null
                          ? DateFormat(
                              'dd MMM yyyy',
                            ).format(DateTime.parse(booking['check_out']))
                          : 'N/A';
                  final roomNumber = booking['room']?['number'] ?? 'Unknown';
                  final guestName = booking['user']?['name'] ?? 'Guest';

                  return InkWell(
                    onTap: () {
                      if (tabController != null) {
                        tabController!.animateTo(3);
                      }
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                        side: BorderSide(color: Colors.grey.shade200),
                      ),
                      elevation: 0.3,
                      child: ListTile(
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 10,
                        ),
                        leading: CircleAvatar(
                          backgroundColor: Colors.black.withOpacity(0.1),
                          child: Icon(
                            Icons.hotel,
                            color: Colors.black,
                            size: 18,
                          ),
                        ),
                        title: Text(
                          'Room $roomNumber',
                          style: GoogleFonts.poppins(
                            fontWeight: FontWeight.w600,
                            fontSize: 14,
                            color: Colors.black,
                          ),
                        ),
                        subtitle: Text(
                          '$guestName\n$checkIn → $checkOut',
                          style: GoogleFonts.poppins(fontSize: 12),
                        ),
                        isThreeLine: true,
                        trailing: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: AppColorss.accent,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            booking['status']?.toUpperCase() ?? 'UNKNOWN',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 10,
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
