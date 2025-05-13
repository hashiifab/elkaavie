import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../main.dart';


String formatCurrency(dynamic price) {
  if (price == null) return 'Rp 0';
  try {
    double numPrice = double.parse(price.toString());
    final formatter = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp ',
      decimalDigits: 0,
    );
    return formatter.format(numPrice);
  } catch (e) {
    return 'Rp $price';
  }
}

Color getStatusColor(String status) {
  switch (status.toLowerCase()) {
    case 'approved':
      return AppColors.success;
    case 'pending':
      return AppColors.warning;
    case 'rejected':
    case 'cancelled':
      return AppColors.error;
    case 'completed':
      return AppColors.info;
    default:
      return AppColors.textSecondary;
  }
}

class AppColorss {
  static const Color primary = Color(0xFF007AFF); // iOS blue
  static const Color accent = Color(0xFF34C759); // iOS green
  static const Color warning = Color(0xFFFF9500); // iOS orange
  static const Color textPrimary = Color(0xFF1C1C1E);
  static const Color textSecondary = Color(0xFF8E8E93);
}