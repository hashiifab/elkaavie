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