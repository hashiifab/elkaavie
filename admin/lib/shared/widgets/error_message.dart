import 'package:flutter/material.dart';
import '../../app/config/colors.dart';

/// Widget pesan kesalahan yang dapat digunakan kembali
/// 
/// Menampilkan pesan kesalahan dengan ikon dan tombol coba lagi
/// Digunakan di berbagai tempat saat terjadi kesalahan dalam mengambil data
class ErrorMessage extends StatelessWidget {
  final String message;
  final VoidCallback? onRetry;
  final IconData icon;
  final Color? iconColor;
  final double iconSize;
  final TextStyle? messageStyle;

  const ErrorMessage({
    Key? key,
    required this.message,
    this.onRetry,
    this.icon = Icons.error_outline,
    this.iconColor,
    this.iconSize = 48.0,
    this.messageStyle,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: iconSize,
              color: iconColor ?? AppColors.error,
            ),
            const SizedBox(height: 16),
            Text(
              message,
              style: messageStyle ?? 
                TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 16,
                ),
              textAlign: TextAlign.center,
            ),
            if (onRetry != null) ...[  
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh),
                label: const Text('Coba Lagi'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}