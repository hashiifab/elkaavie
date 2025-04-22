import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../main.dart';
import '../utils.dart';
import '../utils.dart';

class BookingsTab extends StatelessWidget {
  final List<dynamic> bookings;
  final bool isLoading;
  final Future<void> Function() onRefresh;
  final Future<void> Function(String, String) onUpdateBookingStatus;

  const BookingsTab({
    super.key,
    required this.bookings,
    required this.isLoading,
    required this.onRefresh,
    required this.onUpdateBookingStatus,
  });

  @override
  Widget build(BuildContext context) {
    final validBookings = bookings
        .where((booking) => booking['user'] != null && booking['user']['name'] != null)
        .toList()
      ..sort((a, b) => (b['id'] as int).compareTo(a['id'] as int));

    if (isLoading) return const Center(child: CircularProgressIndicator());

    if (validBookings.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.book_online_outlined, size: 64, color: AppColors.textSecondary),
            const SizedBox(height: 16),
            Text(
              'No bookings found',
              style: TextStyle(fontSize: 18, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: onRefresh,
              icon: const Icon(Icons.refresh),
              label: const Text('Refresh Bookings'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: onRefresh,
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
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
                  label: Text(isLoading ? 'Refreshing...' : 'Refresh Bookings'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: validBookings.length,
              itemBuilder: (context, index) {
                final booking = validBookings[index];
                final isApproved = booking['status'] == 'approved';
                final hasPaymentProof = booking['payment_proof'] != null && booking['payment_proof'].toString().isNotEmpty;

                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: getStatusColor(booking['status']).withOpacity(0.1),
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                'Booking #${booking['id']}',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: getStatusColor(booking['status']),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                booking['status'].toString().toUpperCase(),
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _buildInfoSection(
                              icon: Icons.hotel,
                              title: 'Room Information',
                              color: Colors.blue,
                              children: [
                                _buildInfoRow('Room Number', 'Room ${booking['room']?['number'] ?? booking['room_number'] ?? 'Unknown'}'),
                                _buildInfoRow('Floor', 'Floor ${booking['room']?['floor'] ?? booking['room_floor'] ?? 'Unknown'}'),
                                _buildInfoRow('Type', booking['room']?['roomType']?['name'] ?? booking['room_type'] ?? 'Standard'),
                              ],
                            ),
                            const SizedBox(height: 16),
                            _buildInfoSection(
                              icon: Icons.person,
                              title: 'Guest Information',
                              color: Colors.green,
                              children: [
                                _buildInfoRow('Name', booking['user']?['name'] ?? 'Guest'),
                                _buildInfoRow('Phone', booking['phone_number'] ?? 'N/A'),
                                _buildInfoRow('Guests', '${booking['guests']?.toString() ?? '1'} person(s)'),
                              ],
                            ),
                            const SizedBox(height: 16),
                            _buildInfoSection(
                              icon: Icons.calendar_today,
                              title: 'Booking Details',
                              color: Colors.orange,
                              children: [
                                _buildInfoRow('Check In', booking['check_in'] != null ? DateFormat('dd MMM yyyy').format(DateTime.parse(booking['check_in'])) : 'N/A'),
                                _buildInfoRow('Check Out', booking['check_out'] != null ? DateFormat('dd MMM yyyy').format(DateTime.parse(booking['check_out'])) : 'N/A'),
                                _buildInfoRow('Payment Method', booking['payment_method'] ?? 'Credit Card'),
                                _buildInfoRow('Total Amount', formatCurrency(booking['total_price'])),
                              ],
                            ),
                            if (booking['special_requests'] != null && booking['special_requests'] != '' && booking['special_requests'] != 'None')
                              Padding(
                                padding: const EdgeInsets.only(top: 16),
                                child: _buildInfoSection(
                                  icon: Icons.note_alt,
                                  title: 'Special Requests',
                                  color: Colors.purple,
                                  children: [
                                    Text(
                                      booking['special_requests'],
                                      style: TextStyle(fontSize: 14, color: Colors.grey.shade700),
                                    ),
                                  ],
                                ),
                              ),
                            if (booking['identity_card'] != null && booking['identity_card'] != '')
                              Padding(
                                padding: const EdgeInsets.only(top: 16),
                                child: _buildInfoSection(
                                  icon: Icons.badge,
                                  title: 'Identity Card',
                                  color: Colors.blue,
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(8),
                                      child: Image.network(
                                        booking['identity_card'],
                                        width: double.infinity,
                                        height: 200,
                                        fit: BoxFit.cover,
                                        errorBuilder: (context, error, stackTrace) => Container(
                                          width: double.infinity,
                                          height: 200,
                                          color: Colors.grey.shade200,
                                          child: const Center(child: Text('Failed to load image')),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            if (booking['payment_proof'] != null) ...[
                              const Divider(),
                              Padding(
                                padding: const EdgeInsets.all(16),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Payment Proof',
                                      style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                                    ),
                                    const SizedBox(height: 8),
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(8),
                                      child: Image.network(
                                        booking['payment_proof'],
                                        width: double.infinity,
                                        height: 200,
                                        fit: BoxFit.cover,
                                        errorBuilder: (context, error, stackTrace) => Container(
                                          width: double.infinity,
                                          height: 200,
                                          color: Colors.grey[200],
                                          child: const Center(child: Icon(Icons.error_outline)),
                                        ),
                                      ),
                                    ),
                                    if (isApproved && hasPaymentProof) ...[
                                      const SizedBox(height: 16),
                                      Row(
                                        children: [
                                          Expanded(
                                            child: ElevatedButton.icon(
                                              onPressed: () => onUpdateBookingStatus(booking['id'].toString(), 'paid'),
                                              icon: const Icon(Icons.check_circle_outline),
                                              label: const Text('Verify Payment'),
                                              style: ElevatedButton.styleFrom(
                                                backgroundColor: AppColors.success,
                                                foregroundColor: Colors.white,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 8),
                                          Expanded(
                                            child: OutlinedButton.icon(
                                              onPressed: () => onUpdateBookingStatus(booking['id'].toString(), 'rejected'),
                                              icon: const Icon(Icons.cancel_outlined),
                                              label: const Text('Reject Payment'),
                                              style: OutlinedButton.styleFrom(foregroundColor: AppColors.error),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                            ],
                            const SizedBox(height: 24),
                            if (booking['status'] == 'pending')
                              Row(
                                children: [
                                  Expanded(
                                    child: ElevatedButton.icon(
                                      onPressed: () => onUpdateBookingStatus(booking['id'].toString(), 'approved'),
                                      icon: const Icon(Icons.check_circle),
                                      label: const Text('Approve'),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.green,
                                        padding: const EdgeInsets.symmetric(vertical: 12),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: OutlinedButton.icon(
                                      onPressed: () => onUpdateBookingStatus(booking['id'].toString(), 'rejected'),
                                      icon: const Icon(Icons.cancel),
                                      label: const Text('Reject'),
                                      style: OutlinedButton.styleFrom(
                                        foregroundColor: Colors.red,
                                        padding: const EdgeInsets.symmetric(vertical: 12),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            if (booking['status'] == 'approved')
                              Column(
                                children: [
                                  Center(
                                    child: ElevatedButton.icon(
                                      onPressed: () => onUpdateBookingStatus(booking['id'].toString(), 'completed'),
                                      icon: const Icon(Icons.done_all),
                                      label: const Text('Mark as Completed'),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.blue,
                                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Center(
                                    child: ElevatedButton.icon(
                                      onPressed: () => onUpdateBookingStatus(booking['id'].toString(), 'paid'),
                                      icon: const Icon(Icons.payment),
                                      label: const Text('Verify Payment'),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.green,
                                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            if (booking['status'] == 'paid')
                              Center(
                                child: ElevatedButton.icon(
                                  onPressed: () => onUpdateBookingStatus(booking['id'].toString(), 'completed'),
                                  icon: const Icon(Icons.done_all),
                                  label: const Text('Mark as Completed'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.blue,
                                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
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
          ),
        ],
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
        border: Border.all(color: color.withOpacity(0.2), width: 1),
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
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: color),
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
              style: TextStyle(fontSize: 14, color: Colors.grey.shade600, fontWeight: FontWeight.w500),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}