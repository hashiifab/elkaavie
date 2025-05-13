import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class RoomsTab extends StatelessWidget {
  final List<dynamic> rooms;
  final bool isLoading;
  final Future<void> Function() onRefresh;
  final Future<void> Function() onInitializeRooms;
  final Future<bool> Function(int) onToggleRoomAvailability;
  final Future<void> Function(int) onDeleteRoom;
  final List<dynamic> bookings;
  final TabController? tabController;

  const RoomsTab({
    super.key,
    required this.rooms,
    required this.isLoading,
    required this.onRefresh,
    required this.onInitializeRooms,
    required this.onToggleRoomAvailability,
    required this.onDeleteRoom,
    required this.bookings,
    this.tabController,
  });

  // Di fungsi _findBookingForRoom
  dynamic _findBookingForRoom(int roomId) {
    return bookings.firstWhere(
      (booking) =>
          booking['room']?['id'] == roomId &&
          booking['status'] != 'canceled' &&
          booking['status'] != 'completed' &&
          booking['status'] != 'rejected',
      orElse: () => null,
    );
  }

  Future<void> _showRoomActionDialog(BuildContext context, dynamic room) async {
    final bool isAvailable = room['is_available'] ?? true;
    final int roomId = room['id'];
    final String roomNumber = room['number'] ?? '';
    final dynamic booking = _findBookingForRoom(roomId);
    final bool isPending = booking != null && booking['status'] == 'pending';
    final dynamic user = booking?['user'];

    return showCupertinoDialog(
      context: context,
      builder:
          (dialogContext) => CupertinoAlertDialog(
            title: Text('Room $roomNumber'),
            content: Column(
              children: [
                const SizedBox(height: 8),
                Text('Status: ${isAvailable ? 'Available' : 'Unavailable'}'),
                const SizedBox(height: 8),
                if (!isAvailable && booking != null) ...[
                  Text('Booked by: ${user?['name'] ?? 'Unknown'}'),
                  const SizedBox(height: 4),
                  Text(
                    'Status: ${booking['status']?.toUpperCase() ?? 'UNKNOWN'}',
                  ),
                  const SizedBox(height: 8),
                ],
                Text('What would you like to do with this room?'),
              ],
            ),
            actions: <CupertinoDialogAction>[
              if (!isAvailable && booking != null) ...[
                CupertinoDialogAction(
                  child: const Text('View Booking Details'),
                  onPressed: () {
                    Navigator.of(dialogContext).pop();
                    _showBookingDetails(context, booking, roomNumber);
                  },
                ),
                if (user != null)
                  CupertinoDialogAction(
                    child: const Text('View Guest Profile'),
                    onPressed: () {
                      Navigator.of(dialogContext).pop();
                      _showGuestProfile(context, user);
                    },
                  ),
              ],
              CupertinoDialogAction(
                isDestructiveAction: false,
                child: const Text('Cancel'),
                onPressed: () {
                  Navigator.of(dialogContext).pop();
                },
              ),
              CupertinoDialogAction(
                child: Text(
                  isAvailable ? 'Mark as Unavailable' : 'Mark as Available',
                ),
                onPressed: () async {
                  Navigator.of(dialogContext).pop();
                  try {
                    bool newStatus = await onToggleRoomAvailability(roomId);
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            'Room marked as ${newStatus ? 'available' : 'unavailable'}',
                          ),
                        ),
                      );
                    }
                  } catch (e) {
                    if (context.mounted) {
                      ScaffoldMessenger.of(
                        context,
                      ).showSnackBar(SnackBar(content: Text(e.toString())));
                    }
                  }
                },
              ),
              if (isPending)
                CupertinoDialogAction(
                  isDestructiveAction: true,
                  child: const Text('Batalkan Pending'),
                  onPressed: () async {
                    Navigator.of(dialogContext).pop();
                    // Tambahkan logika pembatalan pending di sini
                  },
                ),
            ],
          ),
    );
  }

  void _showBookingDetails(
    BuildContext context,
    dynamic booking,
    String roomNumber,
  ) {
    if (booking == null) return;

    final String guestName = booking['user']?['name'] ?? 'Unknown';
    final String checkIn = booking['check_in'] ?? 'N/A';
    final String checkOut = booking['check_out'] ?? 'N/A';
    final String status = booking['status'] ?? 'Unknown';

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Booking Details for Room $roomNumber'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildDetailRow('Guest Name', guestName),
              _buildDetailRow('Check In', checkIn),
              _buildDetailRow('Check Out', checkOut),
              _buildDetailRow('Status', status),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Close'),
            ),
            if (booking['user'] != null)
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  // Navigate to Users tab
                  if (tabController != null) {
                    tabController!.animateTo(1); // Index 1 is the Users tab
                  }
                },
                child: const Text('View Guest Profile'),
              ),
          ],
        );
      },
    );
  }

  void _showGuestProfile(BuildContext context, dynamic user) {
    if (user == null) return;

    final userBookings =
        bookings
            .where(
              (booking) =>
                  booking['user']?['id'] == user['id'] &&
                  booking['status'] != 'canceled' &&
                  booking['status'] != 'rejected',
            )
            .toList();

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Guest Profile: ${user['name']}'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildDetailRow('Name', user['name'] ?? 'Unknown'),
              _buildDetailRow('Email', user['email'] ?? 'N/A'),
              if (userBookings.isNotEmpty) ...[
                const SizedBox(height: 16),
                Text(
                  'Booking History',
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                ...userBookings.map((booking) {
                  final roomNumber = booking['room']?['number'] ?? 'Unknown';
                  final checkIn =
                      booking['check_in'] != null
                          ? DateTime.parse(booking['check_in'])
                          : null;
                  final checkOut =
                      booking['check_out'] != null
                          ? DateTime.parse(booking['check_out'])
                          : null;
                  final status = booking['status']?.toUpperCase() ?? 'UNKNOWN';

                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Room $roomNumber',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        if (checkIn != null)
                          Text(
                            'Check In: ${checkIn.day}/${checkIn.month}/${checkIn.year}',
                          ),
                        if (checkOut != null)
                          Text(
                            'Check Out: ${checkOut.day}/${checkOut.month}/${checkOut.year}',
                          ),
                        Text('Status: $status'),
                      ],
                    ),
                  );
                }),
              ],
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) return const Center(child: CircularProgressIndicator());

    if (rooms.isEmpty) {
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
              onPressed: onInitializeRooms,
              icon: const Icon(Icons.add_business),
              label: const Text('Initialize Hotel Rooms'),
            ),
          ],
        ),
      );
    }

    Map<int, List<dynamic>> roomsByFloor = {};
    for (var room in rooms) {
      int floor = room['floor'] ?? 0;

      // Skip kamar di lantai 3 untuk grouping reguler
      if (floor == 3) continue;

      roomsByFloor.putIfAbsent(floor, () => []).add(room);
    }
    // Tambahkan lantai 3 untuk laundry area
    roomsByFloor.putIfAbsent(3, () => []);
    List<int> sortedFloors = roomsByFloor.keys.toList()..sort();

    return RefreshIndicator(
      onRefresh: onRefresh,
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                ElevatedButton.icon(
                  onPressed: onRefresh,
                  icon:
                      isLoading
                          ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(
                                Colors.white,
                              ),
                            ),
                          )
                          : const Icon(Icons.refresh, size: 16),
                  label: Text(isLoading ? 'Refreshing...' : 'Refresh Rooms'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.black87, // warna gece
                    foregroundColor: Colors.white, // teks dan ikon putih
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.white, // dominan putih
                borderRadius: BorderRadius.circular(12), // iOS-style rounded
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05), // shadow lembut
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _buildLegendItem(Colors.green, 'Available'),
                  const SizedBox(width: 24),
                  _buildLegendItem(Colors.red, 'Unavailable'),
                  const SizedBox(width: 24),
                  Row(
                    children: [
                      Container(
                        width: 18,
                        height: 18,
                        decoration: BoxDecoration(
                          color:
                              Colors
                                  .grey
                                  .shade100, // lebih terang karena background putih
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(color: Colors.blue, width: 2),
                        ),
                        child: Align(
                          alignment: Alignment.topRight,
                          child: Container(
                            width: 6,
                            height: 6,
                            decoration: const BoxDecoration(
                              color: Colors.blue,
                              shape: BoxShape.circle,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        'Booked',
                        style: TextStyle(
                          fontWeight: FontWeight.w500,
                          color:
                              Colors.black87, // teks lebih gelap agar terbaca
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),
            for (int floor in sortedFloors) ...[
              // Header Title (Floor / Laundry Area)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Text(
                  floor == 3 ? 'Laundry Area' : 'Floor $floor',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Body Content
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 12,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child:
                    floor == 3
                        ? Column(
                          children: [
                            Icon(
                              Icons.local_laundry_service,
                              size: 48,
                              color: Colors.blue.shade800,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'Laundry Area',
                              style: GoogleFonts.poppins(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Colors.black87,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Area penjemuran dan cuci pakaian untuk penghuni',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.poppins(
                                color: Colors.grey.shade600,
                              ),
                            ),
                          ],
                        )
                        : Column(
                          children: [
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.symmetric(vertical: 8),
                              margin: const EdgeInsets.only(bottom: 16),
                              decoration: BoxDecoration(
                                color: Colors.grey.shade200,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                'Hallway',
                                textAlign: TextAlign.center,
                                style: GoogleFonts.poppins(
                                  color: Colors.grey.shade700,
                                ),
                              ),
                            ),
                            GridView.builder(
                              physics: const NeverScrollableScrollPhysics(),
                              shrinkWrap: true,
                              gridDelegate:
                                  const SliverGridDelegateWithFixedCrossAxisCount(
                                    crossAxisCount: 5,
                                    childAspectRatio: 2.0,
                                    crossAxisSpacing: 10,
                                    mainAxisSpacing: 10,
                                  ),
                              itemCount: roomsByFloor[floor]!.length,
                              itemBuilder: (context, index) {
                                final room = roomsByFloor[floor]![index];
                                final bool isAvailable =
                                    room['is_available'] ?? true;
                                final String roomNumber = room['number'] ?? '';
                                final bool isBooked =
                                    _findBookingForRoom(room['id']) != null;

                                return GestureDetector(
                                  onTap: () {
                                    _showRoomActionDialog(context, room);
                                  },
                                  child: Container(
                                    decoration: BoxDecoration(
                                      color:
                                          isAvailable
                                              ? Colors.green
                                              : Colors.red.withOpacity(0.7),
                                      borderRadius: BorderRadius.circular(10),
                                      border:
                                          !isAvailable && isBooked
                                              ? Border.all(
                                                color: Colors.blue,
                                                width: 2,
                                              )
                                              : null,
                                    ),
                                    child: Stack(
                                      children: [
                                        Center(
                                          child: Text(
                                            roomNumber,
                                            style: GoogleFonts.poppins(
                                              color: Colors.white,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                        if (!isAvailable && isBooked)
                                          Positioned(
                                            top: 2,
                                            right: 2,
                                            child: Container(
                                              width: 8,
                                              height: 8,
                                              decoration: const BoxDecoration(
                                                color: Colors.blue,
                                                shape: BoxShape.circle,
                                              ),
                                            ),
                                          ),
                                      ],
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
        Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
      ],
    );
  }
}
