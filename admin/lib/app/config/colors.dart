import 'package:flutter/material.dart';

/// Centralized color palette for consistent UI theming across the app
/// Follows a material design color scheme with primary, secondary, and accent colors
class AppColors {
  // Primary colors - deep indigo color theme
  static const Color primary = Color(0xFF1A237E); // Deep indigo
  static const Color primaryLight = Color(0xFF534BAE);
  static const Color primaryDark = Color(0xFF000051);
  
  // Secondary colors - light blue accents
  static const Color secondary = Color(0xFF0277BD); // Light blue
  static const Color secondaryLight = Color(0xFF58A5F0);
  static const Color secondaryDark = Color(0xFF004C8C);
  
  // Accent colors - cyan for highlighting
  static const Color accent = Color(0xFF00ACC1); // Cyan
  static const Color accentLight = Color(0xFF5DBCD2);
  static const Color accentDark = Color(0xFF007C91);
  
  // Status colors for notifications and alerts
  static const Color success = Color(0xFF2E7D32); // Green
  static const Color warning = Color(0xFFF57C00); // Orange
  static const Color error = Color(0xFFD32F2F); // Red
  static const Color info = Color(0xFF0288D1); // Blue
  
  // Neutral colors for backgrounds and text
  static const Color background = Color(0xFFF5F5F5);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF212121);
  static const Color textSecondary = Color(0xFF757575);
  static const Color divider = Color(0xFFBDBDBD);
}