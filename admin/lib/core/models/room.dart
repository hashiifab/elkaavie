import 'dart:convert';

/// Model untuk data kamar
/// 
/// Digunakan untuk menyimpan dan mengelola data kamar
// Hapus field yang tidak diperlukan
class Room {
  final int id;
  final String type;
  final int price;
  final int capacity;
  final bool isAvailable;
  final String? createdAt;
  final String? updatedAt;

  // Hapus parameter yang tidak diperlukan dari constructor
  Room({
    required this.id,
    required this.type,
    required this.price,
    required this.capacity,
    required this.isAvailable,
    this.createdAt,
    this.updatedAt,
  });

  // Update fromJson/toJson
  factory Room.fromJson(Map<String, dynamic> json) {
    return Room(
      id: json['id'],
      type: json['type'],
      price: json['price'],
      capacity: json['capacity'],
      isAvailable: json['is_available'] ?? true,
      createdAt: json['created_at'],
      updatedAt: json['updated_at'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'price': price,
      'capacity': capacity,
      'is_available': isAvailable,
      'created_at': createdAt,
      'updated_at': updatedAt,
    };
  }
}