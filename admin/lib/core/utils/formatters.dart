import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../app/config/colors.dart';

/// Format nilai mata uang ke format Rupiah
/// 
/// Contoh: 10000 -> Rp 10.000
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

/// Mendapatkan warna berdasarkan status
/// 
/// Digunakan untuk menampilkan warna yang sesuai dengan status
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

/// Format tanggal ke format yang lebih mudah dibaca
/// 
/// Contoh: 2023-01-01 -> 1 Jan 2023
String formatDate(String? dateString) {
  if (dateString == null || dateString.isEmpty) return '-';
  try {
    final date = DateTime.parse(dateString);
    return DateFormat('d MMM yyyy', 'id_ID').format(date);
  } catch (e) {
    return dateString;
  }
}

/// Format tanggal dan waktu ke format yang lebih mudah dibaca
/// 
/// Contoh: 2023-01-01 12:00:00 -> 1 Jan 2023, 12:00
String formatDateTime(String? dateTimeString) {
  if (dateTimeString == null || dateTimeString.isEmpty) return '-';
  try {
    final dateTime = DateTime.parse(dateTimeString);
    return DateFormat('d MMM yyyy, HH:mm', 'id_ID').format(dateTime);
  } catch (e) {
    return dateTimeString;
  }
}