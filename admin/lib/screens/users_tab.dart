import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../utils/ui_components.dart';
import '../main.dart';

class AppColors {
  static const Color primary = Color(0xFF4CAF50); // Warna utama hijau
  static const Color secondary = Color(0xFF9E9E9E); // Warna sekunder abu-abu
  static const Color textPrimary = Color(0xFF212121); // Warna teks utama
  static const Color textSecondary = Color(0xFF757575); // Warna teks sekunder
  static const Color background = Color(0xFFF5F5F5); // Warna latar belakang
  static const Color success = Color(0xFF2E7D32); // Success color (same as in main.dart)
}

class UsersTab extends StatelessWidget {
  final List<dynamic> users;
  final List<dynamic> bookings;
  final bool isLoading;
  final Future<void> Function() onRefresh;

  const UsersTab({
    super.key,
    required this.users,
    required this.bookings,
    required this.isLoading,
    required this.onRefresh,
  });

  // Separate admin and regular users
  List<dynamic> getAdminUsers(List<dynamic> allUsers) {
    return allUsers.where((user) => user['role'] == 'admin').toList();
  }

  List<dynamic> getRegularUsers(List<dynamic> allUsers) {
    return allUsers.where((user) => user['role'] != 'admin').toList();
  }

  List<dynamic> getUserBookings(dynamic userId) {
    return bookings
        .where((booking) => booking['user']?['id'] == userId)
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    // Separate admin and regular users
    final adminUsers = getAdminUsers(users);
    final regularUsers = getRegularUsers(users);

    return RefreshIndicator(
      onRefresh: onRefresh,
      child: Column(
        children: [
          // Add consistent top padding
          const SizedBox(height: 24),
          // Simple admin indicator in header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Text(
                      'Users',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    if (adminUsers.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(left: 12),
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: 12,
                              backgroundColor: Colors.amber,
                              child: Text(
                                adminUsers.first['name']?[0]?.toUpperCase() ??
                                    'A',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              'Admin: ${adminUsers.first['name'] ?? 'Admin'}',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
                AdminRefreshButton.refreshButton(
                  onPressed: onRefresh,
                  isLoading: isLoading,
                  backgroundColor: AppColors.success,
                ),
              ],
            ),
          ),

          // User count indicator
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.secondary,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${regularUsers.length}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  regularUsers.length == 1 ? 'User' : 'Users',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),

          // Regular users list
          Expanded(
            child:
                regularUsers.isEmpty
                    ? Center(
                      child: Padding(
                        padding: const EdgeInsets.all(32),
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
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: AppColors.textSecondary,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Try refreshing the list',
                              style: TextStyle(
                                fontSize: 16,
                                color: AppColors.textSecondary,
                              ),
                            ),
                            const SizedBox(height: 16),
                            AdminRefreshButton.refreshButton(
                              onPressed: onRefresh,
                              isLoading: isLoading,
                              backgroundColor: AppColors.success,
                              label: 'Refresh',
                            ),
                          ],
                        ),
                      ),
                    )
                    : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: regularUsers.length,
                      itemBuilder: (context, index) {
                        final user = regularUsers[index];
                        final userBookings = getUserBookings(user['id']);

                        return Card(
                          margin: const EdgeInsets.only(bottom: 16),
                          elevation: 1,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Row(
                              children: [
                                CircleAvatar(
                                  backgroundColor: AppColors.primary,
                                  child: Text(
                                    user['name']?[0]?.toUpperCase() ?? 'U',
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        user['name'] ?? 'Unknown',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        user['email'] ?? 'No email',
                                        style: TextStyle(
                                          color: AppColors.textSecondary,
                                        ),
                                      ),
                                      if (userBookings.isNotEmpty)
                                        Padding(
                                          padding: const EdgeInsets.only(
                                            top: 4,
                                          ),
                                          child: Text(
                                            '${userBookings.length} booking(s)',
                                            style: const TextStyle(
                                              fontStyle: FontStyle.italic,
                                              color: Colors.blue,
                                            ),
                                          ),
                                        ),
                                    ],
                                  ),
                                ),
                                if (userBookings.isNotEmpty)
                                  IconButton(
                                    icon: const Icon(Icons.expand_more),
                                    onPressed: () {
                                      _showUserBookings(
                                        context,
                                        user,
                                        userBookings,
                                      );
                                    },
                                  ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
          ),
        ],
      ),
    );
  }

  void _showUserBookings(
    BuildContext context,
    dynamic user,
    List<dynamic> userBookings,
  ) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Container(
          decoration: BoxDecoration(color: Colors.white),
          padding: const EdgeInsets.all(16),
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.6,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${user['name']}\'s Bookings',
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const Divider(color: Colors.grey),
              Expanded(
                child:
                    userBookings.isEmpty
                        ? const Center(child: Text('No bookings found'))
                        : ListView.builder(
                          itemCount: userBookings.length,
                          itemBuilder: (context, index) {
                            final booking = userBookings[index];
                            final roomNumber =
                                booking['room']?['number'] ?? 'Unknown';
                            final checkIn =
                                booking['check_in'] != null
                                    ? DateFormat('dd MMM yyyy').format(
                                      DateTime.parse(booking['check_in']),
                                    )
                                    : 'N/A';
                            final checkOut =
                                booking['check_out'] != null
                                    ? DateFormat('dd MMM yyyy').format(
                                      DateTime.parse(booking['check_out']),
                                    )
                                    : 'N/A';
                            final status = booking['status'] ?? 'unknown';
                            final statusColor = _getStatusColor(status);

                            return Card(
                              margin: const EdgeInsets.only(bottom: 8),
                              elevation: 1,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: ListTile(
                                leading: CircleAvatar(
                                  backgroundColor: AppColors.primary.withAlpha(
                                    25,
                                  ), // 0.1 * 255 = ~25
                                  child: Text(
                                    roomNumber,
                                    style: TextStyle(color: AppColors.primary),
                                  ),
                                ),
                                title: Text('Room $roomNumber'),
                                subtitle: Text('$checkIn to $checkOut'),
                                trailing: Chip(
                                  label: Text(
                                    status.toUpperCase(),
                                    style: TextStyle(
                                      color: statusColor,
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  backgroundColor: statusColor.withAlpha(
                                    25,
                                  ), // 0.1 * 255 = ~25
                                ),
                              ),
                            );
                          },
                        ),
              ),
            ],
          ),
        );
      },
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.orange;
      case 'confirmed':
      case 'approved':
        return Colors.green;
      case 'canceled':
      case 'cancelled':
      case 'rejected':
        return Colors.red;
      case 'completed':
      case 'paid':
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }
}
