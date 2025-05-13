import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../main.dart';
import '../utils.dart';

class BookingsTab extends StatefulWidget {
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
  State<BookingsTab> createState() => _BookingsTabState();
}

class _BookingsTabState extends State<BookingsTab> {
  String _selectedFilter = 'all';
  final Map<String, String> _filters = {
    'all': 'All Bookings',
    'pending': 'Pending',
    'approved': 'Approved',
    'paid': 'Paid',
    'completed': 'Completed',
    'rejected': 'Rejected',
    'canceled': 'Canceled',
  };

  Map<int, bool> _expandedBookings = {};

  // Method to set filter externally (can be called from dashboard)
  void setFilter(String filter) {
    if (_filters.containsKey(filter)) {
      setState(() {
        _selectedFilter = filter;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // Filter dan sort booking dengan null-safety
    final validBookings =
        widget.bookings
            .where((booking) => booking['user']?['name'] != null)
            .toList()
          ..sort((a, b) => (b['id'] as int).compareTo(a['id'] as int));

    final filteredBookings =
        _selectedFilter == 'all'
            ? validBookings
            : validBookings
                .where((booking) => booking['status'] == _selectedFilter)
                .toList();

    if (widget.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (validBookings.isEmpty) {
      return Center(
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
              style: TextStyle(fontSize: 18, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: widget.onRefresh,
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
      onRefresh: widget.onRefresh,
      child: Column(
        children: [
          _buildFilterSection(validBookings),
          Expanded(
            child:
                filteredBookings.isEmpty
                    ? Center(
                      child: Text(
                        'No ${_filters[_selectedFilter]?.toLowerCase() ?? _selectedFilter} bookings found',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 16,
                        ),
                      ),
                    )
                    : ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      itemCount: filteredBookings.length,
                      itemBuilder: (context, index) {
                        final booking = filteredBookings[index];
                        final bookingId = booking['id'];
                        final isExpanded =
                            _expandedBookings[bookingId] ?? false;
                        final isApproved = booking['status'] == 'approved';
                        final hasPaymentProof =
                            booking['payment_proof']?.toString().isNotEmpty ??
                            false;

                        return Card(
                          margin: const EdgeInsets.only(bottom: 16),
                          child: Column(
                            children: [
                              _buildHeader(booking, isExpanded, () {
                                setState(() {
                                  _expandedBookings[bookingId] = !isExpanded;
                                });
                              }),
                              if (isExpanded)
                                _buildDetails(
                                  context,
                                  booking,
                                  isApproved,
                                  hasPaymentProof,
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

  Widget _buildFilterSection(List<dynamic> bookings) {
    // Count bookings by status
    Map<String, int> statusCounts = {'all': bookings.length};
    for (var status in _filters.keys.where((s) => s != 'all')) {
      statusCounts[status] =
          bookings.where((b) => b['status'] == status).length;
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Filter Bookings',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  color: AppColors.textPrimary,
                ),
              ),
              if (widget.isLoading)
                const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              else
                IconButton(
                  icon: const Icon(Icons.refresh, size: 20),
                  onPressed: widget.onRefresh,
                  tooltip: 'Refresh bookings',
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
            ],
          ),
          const SizedBox(height: 12),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children:
                  _filters.entries.map((entry) {
                    final isSelected = _selectedFilter == entry.key;
                    final count = statusCounts[entry.key] ?? 0;

                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        label: Text('${entry.value} ($count)'),
                        selected: isSelected,
                        onSelected: (selected) {
                          setState(() {
                            _selectedFilter = entry.key;
                          });
                        },
                        backgroundColor: Colors.grey.shade100,
                        selectedColor: AppColors.primary.withOpacity(0.2),
                        checkmarkColor: AppColors.primary,
                        labelStyle: TextStyle(
                          color:
                              isSelected
                                  ? AppColors.primary
                                  : AppColors.textSecondary,
                          fontWeight:
                              isSelected ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                    );
                  }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(
    Map<String, dynamic> booking,
    bool isExpanded,
    VoidCallback onToggle,
  ) {
    final roomNumber =
        booking['room']?['number'] ?? booking['room_number'] ?? 'Unknown';
    final guestName = booking['user']?['name'] ?? 'Guest';

    return InkWell(
      onTap: onToggle,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: getStatusColor(booking['status']).withOpacity(0.1),
          borderRadius:
              isExpanded
                  ? const BorderRadius.vertical(top: Radius.circular(12))
                  : BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        'Room $roomNumber',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: getStatusColor(booking['status']),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          booking['status'].toString().toUpperCase(),
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 10,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    guestName,
                    style: TextStyle(color: Colors.grey.shade700),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Check-in: ${booking['check_in'] != null ? DateFormat('dd MMM yyyy').format(DateTime.parse(booking['check_in'])) : 'N/A'}',
                    style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                  ),
                ],
              ),
            ),
            Icon(
              isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
              color: Colors.grey.shade600,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetails(
    BuildContext context,
    Map<String, dynamic> booking,
    bool isApproved,
    bool hasPaymentProof,
  ) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildCollapsibleSection(
            title: 'Room Information',
            icon: Icons.hotel,
            color: Colors.blue,
            children: [
              _buildInfoRow(
                'Room Number',
                booking['room']?['number']?.toString() ??
                    booking['room_number']?.toString() ??
                    'Unknown',
              ),
              _buildInfoRow(
                'Floor',
                booking['room']?['floor']?.toString() ??
                    booking['room_floor']?.toString() ??
                    'Unknown',
              ),
              _buildInfoRow('Type', 'Standard'),
            ],
          ),
          const SizedBox(height: 16),
          _buildCollapsibleSection(
            title: 'Guest Information',
            icon: Icons.person,
            color: Colors.green,
            children: [
              _buildInfoRow(
                'Name',
                booking['user']?['name']?.toString() ?? 'Guest',
              ),
              _buildInfoRow(
                'Phone',
                booking['phone_number']?.toString() ?? 'N/A',
              ),
              _buildInfoRow(
                'Guests',
                '${booking['guests']?.toString() ?? '1'} person(s)',
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildCollapsibleSection(
            title: 'Booking Details',
            icon: Icons.calendar_today,
            color: Colors.orange,
            children: [
              _buildInfoRow(
                'Check In',
                booking['check_in'] != null
                    ? DateFormat(
                      'dd MMM yyyy',
                    ).format(DateTime.parse(booking['check_in']))
                    : 'N/A',
              ),
              _buildInfoRow(
                'Check Out',
                booking['check_out'] != null
                    ? DateFormat(
                      'dd MMM yyyy',
                    ).format(DateTime.parse(booking['check_out']))
                    : 'N/A',
              ),
              _buildInfoRow(
                'Payment Method',
                booking['payment_method']?.toString() ?? 'Credit Card',
              ),
              _buildInfoRow(
                'Total Amount',
                formatCurrency(booking['total_price']),
              ),
            ],
          ),
          if (booking['special_requests']?.toString().isNotEmpty == true &&
              booking['special_requests'] != 'None')
            Padding(
              padding: const EdgeInsets.only(top: 16),
              child: _buildCollapsibleSection(
                title: 'Special Requests',
                icon: Icons.note_alt,
                color: Colors.purple,
                children: [
                  Text(
                    booking['special_requests'].toString(),
                    style: TextStyle(fontSize: 14, color: Colors.grey.shade700),
                  ),
                ],
              ),
            ),
          if (booking['identity_card']?.toString().isNotEmpty == true)
            Padding(
              padding: const EdgeInsets.only(top: 16),
              child: _buildCollapsibleSection(
                title: 'Identity Card',
                icon: Icons.badge,
                color: Colors.blue,
                initiallyExpanded: false,
                children: [
                  _buildNetworkImage(
                    context,
                    booking['identity_card'].toString(),
                    'identity-cards',
                  ),
                ],
              ),
            ),
          if (hasPaymentProof) ...[
            const Divider(),
            Padding(
              padding: const EdgeInsets.only(top: 16),
              child: _buildCollapsibleSection(
                title: 'Payment Proof',
                icon: Icons.payment,
                color: Colors.teal,
                initiallyExpanded: false,
                children: [
                  _buildNetworkImage(
                    context,
                    booking['payment_proof'].toString(),
                    'payment-proofs',
                  ),
                  if (isApproved && hasPaymentProof) ...[
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () async {
                              final bool? confirm = await showDialog<bool>(
                                context: context,
                                builder: (BuildContext confirmContext) {
                                  return AlertDialog(
                                    title: const Text(
                                      'Konfirmasi Verifikasi Pembayaran',
                                    ),
                                    content: const Text(
                                      'Apakah Anda yakin ingin memverifikasi pembayaran ini? Status booking akan berubah menjadi "PAID".',
                                    ),
                                    actions: <Widget>[
                                      TextButton(
                                        child: const Text('Batal'),
                                        onPressed: () {
                                          Navigator.of(
                                            confirmContext,
                                          ).pop(false);
                                        },
                                      ),
                                      TextButton(
                                        child: const Text('Ya, Verifikasi'),
                                        onPressed: () {
                                          Navigator.of(
                                            confirmContext,
                                          ).pop(true);
                                        },
                                      ),
                                    ],
                                  );
                                },
                              );

                              if (confirm == true) {
                                await widget.onUpdateBookingStatus(
                                  booking['id'].toString(),
                                  'paid',
                                );
                              }
                            },
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
                            onPressed: () async {
                              final bool? confirm = await showDialog<bool>(
                                context: context,
                                builder: (BuildContext confirmContext) {
                                  return AlertDialog(
                                    title: const Text(
                                      'Konfirmasi Penolakan Pembayaran',
                                    ),
                                    content: const Text(
                                      'Apakah Anda yakin ingin menolak pembayaran ini? Status booking akan berubah menjadi "REJECTED".',
                                    ),
                                    actions: <Widget>[
                                      TextButton(
                                        child: const Text('Batal'),
                                        onPressed: () {
                                          Navigator.of(
                                            confirmContext,
                                          ).pop(false);
                                        },
                                      ),
                                      TextButton(
                                        child: const Text('Ya, Tolak'),
                                        onPressed: () {
                                          Navigator.of(
                                            confirmContext,
                                          ).pop(true);
                                        },
                                      ),
                                    ],
                                  );
                                },
                              );

                              if (confirm == true) {
                                await widget.onUpdateBookingStatus(
                                  booking['id'].toString(),
                                  'rejected',
                                );
                              }
                            },
                            icon: const Icon(Icons.cancel_outlined),
                            label: const Text('Reject Payment'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AppColors.error,
                            ),
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
          _buildActionButtons(context, booking),
        ],
      ),
    );
  }

  Widget _buildCollapsibleSection({
    required String title,
    required IconData icon,
    required Color color,
    required List<Widget> children,
    bool initiallyExpanded = true,
  }) {
    return Theme(
      data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
      child: ExpansionTile(
        title: Row(
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
        tilePadding: EdgeInsets.zero,
        initiallyExpanded: initiallyExpanded,
        childrenPadding: const EdgeInsets.only(bottom: 8),
        children: children,
      ),
    );
  }

  Widget _buildNetworkImage(
    BuildContext context,
    String imagePath,
    String storagePath,
  ) {
    final filename =
        imagePath.contains('/') ? imagePath.split('/').last : imagePath;
    final imageUrl = 'http://10.0.2.2:8000/storage/$storagePath/$filename';

    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: Image.network(
        imageUrl,
        width: double.infinity,
        height: 200,
        fit: BoxFit.cover,
        loadingBuilder: (context, child, loadingProgress) {
          if (loadingProgress == null) return child;
          return Container(
            width: double.infinity,
            height: 200,
            color: Colors.grey.shade200,
            child: Center(
              child: CircularProgressIndicator(
                value:
                    loadingProgress.expectedTotalBytes != null
                        ? loadingProgress.cumulativeBytesLoaded /
                            loadingProgress.expectedTotalBytes!
                        : null,
              ),
            ),
          );
        },
        errorBuilder: (context, error, stackTrace) {
          debugPrint('Failed to load image: $imageUrl, error: $error');
          return Container(
            width: double.infinity,
            height: 200,
            color: Colors.grey.shade200,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.broken_image_outlined,
                  size: 48,
                  color: Colors.grey,
                ),
                const SizedBox(height: 8),
                Text(
                  'Failed to load image',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey.shade600),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildActionButtons(
    BuildContext context,
    Map<String, dynamic> booking,
  ) {
    final status = booking['status']?.toString() ?? 'pending';

    switch (status) {
      case 'pending':
        return Row(
          children: [
            Expanded(
              child: ElevatedButton.icon(
                onPressed: () async {
                  final bool? confirm = await showDialog<bool>(
                    context: context,
                    builder: (BuildContext confirmContext) {
                      return AlertDialog(
                        title: const Text('Konfirmasi Persetujuan Booking'),
                        content: const Text(
                          'Apakah Anda yakin ingin menyetujui booking ini? Status akan berubah menjadi "APPROVED" dan pemberitahuan akan dikirim ke WhatsApp tamu.',
                        ),
                        actions: <Widget>[
                          TextButton(
                            child: const Text('Batal'),
                            onPressed: () {
                              Navigator.of(confirmContext).pop(false);
                            },
                          ),
                          TextButton(
                            child: const Text('Ya, Setujui'),
                            onPressed: () {
                              Navigator.of(confirmContext).pop(true);
                            },
                          ),
                        ],
                      );
                    },
                  );

                  if (confirm == true) {
                    final phoneNumber =
                        booking['phone_number']?.toString().replaceAll(
                          RegExp(r'[^0-9]'),
                          '',
                        ) ??
                        '';
                    if (phoneNumber.isNotEmpty) {
                      // Get booking details for message
                      final bookingId = booking['id'].toString();
                      final roomNumber =
                          booking['room']?['number'] ??
                          booking['room_number'] ??
                          'Unknown';

                      // Use the special endpoint that generates a token and redirects to the frontend
                      final userId = booking['user']?['id']?.toString() ?? '';
                      final autoLoginUrl =
                          'http://localhost:8000/api/auto-login-redirect/$bookingId/$userId';

                      // Create WhatsApp message with auto-login link
                      final message =
                          'Your booking #$bookingId has been approved! Room $roomNumber is now confirmed for your stay.\n\nClick here to view your booking details (no login required): $autoLoginUrl';
                      final encodedMessage = Uri.encodeComponent(message);
                      final whatsappUrl =
                          'https://wa.me/$phoneNumber?text=$encodedMessage';

                      try {
                        final canLaunch = await canLaunchUrl(
                          Uri.parse(whatsappUrl),
                        );
                        if (canLaunch) {
                          await launchUrl(Uri.parse(whatsappUrl));
                        } else if (mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Failed to open WhatsApp'),
                            ),
                          );
                        }
                      } catch (e) {
                        if (mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Error: ${e.toString()}')),
                          );
                        }
                      }
                    }
                    await widget.onUpdateBookingStatus(
                      booking['id'].toString(),
                      'approved',
                    );
                  }
                },
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
                onPressed: () async {
                  final bool? confirm = await showDialog<bool>(
                    context: context,
                    builder: (BuildContext confirmContext) {
                      return AlertDialog(
                        title: const Text('Konfirmasi Penolakan Booking'),
                        content: const Text(
                          'Apakah Anda yakin ingin menolak booking ini? Status akan berubah menjadi "REJECTED".',
                        ),
                        actions: <Widget>[
                          TextButton(
                            child: const Text('Batal'),
                            onPressed: () {
                              Navigator.of(confirmContext).pop(false);
                            },
                          ),
                          TextButton(
                            child: const Text('Ya, Tolak'),
                            onPressed: () {
                              Navigator.of(confirmContext).pop(true);
                            },
                          ),
                        ],
                      );
                    },
                  );

                  if (confirm == true) {
                    await widget.onUpdateBookingStatus(
                      booking['id'].toString(),
                      'rejected',
                    );
                  }
                },
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
        );
      case 'approved':
        return Center(
          child: CupertinoButton.filled(
            color: Colors.red,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            borderRadius: BorderRadius.circular(8),
            onPressed: () async {
              final bool? confirm = await showCupertinoDialog<bool>(
                context: context,
                builder: (confirmContext) {
                  return CupertinoAlertDialog(
                    title: const Text(
                      'Konfirmasi Penyelesaian Booking',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    content: const Padding(
                      padding: EdgeInsets.only(top: 8.0),
                      child: Text(
                        'Apakah Anda yakin ingin menolak menyelesaikan booking ini? '
                        'Status akan berubah menjadi "COMPLETE".',
                      ),
                    ),
                    actions: <CupertinoDialogAction>[
                      CupertinoDialogAction(
                        onPressed:
                            () => Navigator.of(confirmContext).pop(false),
                        child: const Text('Batal'),
                      ),
                      CupertinoDialogAction(
                        isDestructiveAction: true,
                        onPressed: () => Navigator.of(confirmContext).pop(true),
                        child: const Text('Ya, Selesai'),
                      ),
                    ],
                  );
                },
              );

              if (confirm == true) {
                await widget.onUpdateBookingStatus(
                  booking['id'].toString(),
                  'completed',
                );
              }
            },
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: const [
                Text('Cancel Booking'),
              ],
            ),
          ),
        );
      case 'paid':
        return Center(
          child: ElevatedButton.icon(
            onPressed: () async {
              final bool? confirm = await showDialog<bool>(
                context: context,
                builder: (BuildContext confirmContext) {
                  return AlertDialog(
                    title: const Text('Konfirmasi Penyelesaian Booking'),
                    content: const Text(
                      'Apakah Anda yakin ingin menyelesaikan booking ini? Status akan berubah menjadi "COMPLETED".',
                    ),
                    actions: <Widget>[
                      TextButton(
                        child: const Text('Batal'),
                        onPressed: () {
                          Navigator.of(confirmContext).pop(false);
                        },
                      ),
                      TextButton(
                        child: const Text('Ya, Selesaikan'),
                        onPressed: () {
                          Navigator.of(confirmContext).pop(true);
                        },
                      ),
                    ],
                  );
                },
              );

              if (confirm == true) {
                await widget.onUpdateBookingStatus(
                  booking['id'].toString(),
                  'completed',
                );
              }
            },
            icon: const Icon(Icons.done_all),
            label: const Text('Mark as Completed'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        );
      default:
        return const SizedBox.shrink();
    }
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
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
