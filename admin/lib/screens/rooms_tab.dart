import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../main.dart';

class RoomsTab extends StatelessWidget {
  final List<dynamic> rooms;
  final bool isLoading;
  final Future<void> Function() onRefresh;
  final Future<void> Function() onInitializeRooms;
  final Future<bool> Function(int) onToggleRoomAvailability;
  final Future<void> Function(int) onDeleteRoom;
  final List<dynamic> bookings;

  const RoomsTab({
    super.key,
    required this.rooms,
    required this.isLoading,
    required this.onRefresh,
    required this.onInitializeRooms,
    required this.onToggleRoomAvailability,
    required this.onDeleteRoom,
    required this.bookings,
  });

  dynamic _findBookingForRoom(int roomId) {
    return bookings.firstWhere(
      (booking) => booking['room']?['id'] == roomId,
      orElse: () => null,
    );
  }

  Future<void> _showRoomActionDialog(BuildContext context, dynamic room) async {
    final bool isAvailable = room['is_available'] ?? true;
    final int roomId = room['id'];
    final String roomNumber = room['number'] ?? '';
    final dynamic booking = _findBookingForRoom(roomId);
    final bool isBooked = booking != null;

    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext dialogContext) {
        return AlertDialog(
          title: Text('Room $roomNumber'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text('Status: ${isAvailable ? 'Available' : 'Unavailable'}'),
                const SizedBox(height: 8),
                Text('What would you like to do with this room?'),
              ],
            ),
          ),
          actions: <Widget>[
            if (!isAvailable && isBooked)
              TextButton(
                child: const Text('View Booking Details'),
                onPressed: () {
                  Navigator.of(dialogContext).pop();
                  _showBookingDetails(context, booking, roomNumber);
                },
              ),
            TextButton(
              child: const Text('Cancel'),
              onPressed: () {
                Navigator.of(dialogContext).pop();
              },
            ),
            TextButton(
              child: Text(isAvailable ? 'Mark as Unavailable' : 'Mark as Available'),
              onPressed: () async {
                Navigator.of(dialogContext).pop();
                try {
                  bool newStatus = await onToggleRoomAvailability(roomId);
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Room marked as ${newStatus ? 'available' : 'unavailable'}')),
                    );
                  }
                } catch (e) {
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(e.toString())),
                    );
                  }
                }
              },
            ),
          ],
        );
      },
    );
  }

  void _showBookingDetails(BuildContext context, dynamic booking, String roomNumber) {
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
              style: GoogleFonts.poppins(fontSize: 18, color: Colors.grey.shade700),
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
                  icon: isLoading
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : const Icon(Icons.refresh, size: 16),
                  label: Text(isLoading ? 'Refreshing...' : 'Refresh Rooms'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
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
                  const SizedBox(width: 24),
                  Row(
                    children: [
                      Container(
                        width: 18, 
                        height: 18,
                        decoration: BoxDecoration(
                          color: Colors.grey.shade300,
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
                      const Text('Booked', style: TextStyle(fontWeight: FontWeight.w500)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            for (int floor in sortedFloors) ...[
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.blue.shade900,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  floor == 3 ? 'Laundry Area' : 'Floor $floor',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: floor == 3
                    ? Column(
                        children: [
                          Icon(
                            Icons.local_laundry_service,
                            size: 48,
                            color: Colors.blue.shade900,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Laundry Area',
                            style: GoogleFonts.poppins(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.grey.shade900,
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
                        color: Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        'Hallway',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey.shade700),
                      ),
                    ),
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
                        final bool isBooked = _findBookingForRoom(room['id']) != null;

                        return GestureDetector(
                          onTap: () {
                            _showRoomActionDialog(context, room);
                          },
                          child: Container(
                            decoration: BoxDecoration(
                              color: isAvailable ? Colors.green : Colors.red.withOpacity(0.7),
                              borderRadius: BorderRadius.circular(8),
                              border: isBooked ? Border.all(color: Colors.blue, width: 2) : null,
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
                                if (isBooked)
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