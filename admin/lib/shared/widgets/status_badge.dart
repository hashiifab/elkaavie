import 'package:flutter/material.dart';
import '../../core/utils/formatters.dart';

/// Widget badge status yang dapat digunakan kembali
/// 
/// Menampilkan status dengan warna yang sesuai
/// Digunakan di berbagai tempat seperti daftar booking, pengguna, dll.
class StatusBadge extends StatelessWidget {
  final String status;
  final double? fontSize;
  final EdgeInsetsGeometry? padding;

  const StatusBadge({
    Key? key,
    required this.status,
    this.fontSize,
    this.padding,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding ?? const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: getStatusColor(status).withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: getStatusColor(status),
          width: 1,
        ),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(
          color: getStatusColor(status),
          fontWeight: FontWeight.bold,
          fontSize: fontSize ?? 12,
        ),
      ),
    );
  }
}