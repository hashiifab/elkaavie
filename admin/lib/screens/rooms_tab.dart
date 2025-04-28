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

  const RoomsTab({
    super.key,
    required this.rooms,
    required this.isLoading,
    required this.onRefresh,
    required this.onInitializeRooms,
    required this.onToggleRoomAvailability,
    required this.onDeleteRoom,
  });

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
      roomsByFloor.putIfAbsent(floor, () => []).add(room);
    }
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

                        return GestureDetector(
                          onTap: () async {
                            try {
                              bool newStatus = await onToggleRoomAvailability(room['id']);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Room marked as ${newStatus ? 'available' : 'unavailable'}')),
                              );
                            } catch (e) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text(e.toString())),
                              );
                            }
                          },
                          child: Container(
                            decoration: BoxDecoration(
                                    color: isAvailable ? Colors.green : Colors.red.withOpacity(0.7),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Center(
                              child: Text(
                                      roomNumber,
                                style: GoogleFonts.poppins(
                                        color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
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
        Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
      ],
    );
  }
}