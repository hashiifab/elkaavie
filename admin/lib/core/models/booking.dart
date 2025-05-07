import 'user.dart';
import 'room.dart';

/// Model untuk data pemesanan kamar
///
/// Digunakan untuk menyimpan dan mengelola data pemesanan
class Booking {
  final int id;
  final int userId;
  final int roomId;
  final String checkIn;
  final String checkOut;
  final int durationMonths;
  final int totalPrice;
  final String status;
  final String? paymentMethod;
  final String? paymentProof;
  final String? notes;
  final String? createdAt;
  final String? updatedAt;
  final User? user;
  final Room? room;

  Booking({
    required this.id,
    required this.userId,
    required this.roomId,
    required this.checkIn,
    required this.checkOut,
    this.durationMonths = 1,
    required this.totalPrice,
    required this.status,
    this.paymentMethod,
    this.paymentProof,
    this.notes,
    this.createdAt,
    this.updatedAt,
    this.user,
    this.room,
  });

  /// Membuat instance Booking dari JSON
  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      id: json['id'],
      userId: json['user_id'],
      roomId: json['room_id'],
      checkIn: json['check_in'],
      checkOut: json['check_out'],
      durationMonths: json['duration_months'] ?? 1,
      totalPrice: json['total_price'],
      status: json['status'],
      paymentMethod: json['payment_method'],
      paymentProof: json['payment_proof'],
      notes: json['notes'],
      createdAt: json['created_at'],
      updatedAt: json['updated_at'],
      user: json['user'] != null ? User.fromJson(json['user']) : null,
      room: json['room'] != null ? Room.fromJson(json['room']) : null,
    );
  }

  /// Mengkonversi Booking ke JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'room_id': roomId,
      'check_in': checkIn,
      'check_out': checkOut,
      'duration_months': durationMonths,
      'total_price': totalPrice,
      'status': status,
      'payment_method': paymentMethod,
      'payment_proof': paymentProof,
      'notes': notes,
      'created_at': createdAt,
      'updated_at': updatedAt,
      'user': user?.toJson(),
      'room': room?.toJson(),
    };
  }

  /// Membuat salinan Booking dengan nilai yang diperbarui
  Booking copyWith({
    int? id,
    int? userId,
    int? roomId,
    String? checkIn,
    String? checkOut,
    int? durationMonths,
    int? totalPrice,
    String? status,
    String? paymentMethod,
    String? paymentProof,
    String? notes,
    String? createdAt,
    String? updatedAt,
    User? user,
    Room? room,
  }) {
    return Booking(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      roomId: roomId ?? this.roomId,
      checkIn: checkIn ?? this.checkIn,
      checkOut: checkOut ?? this.checkOut,
      durationMonths: durationMonths ?? this.durationMonths,
      totalPrice: totalPrice ?? this.totalPrice,
      status: status ?? this.status,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      paymentProof: paymentProof ?? this.paymentProof,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      user: user ?? this.user,
      room: room ?? this.room,
    );
  }

  @override
  String toString() {
    return 'Booking(id: $id, userId: $userId, roomId: $roomId, status: $status)';
  }
}