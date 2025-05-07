import 'package:flutter/material.dart';
import '../../app/config/colors.dart';

/// Widget indikator loading yang dapat digunakan kembali
/// 
/// Menampilkan indikator loading dengan warna dan ukuran yang dapat disesuaikan
/// Digunakan di berbagai tempat saat menunggu data dari API
class LoadingIndicator extends StatelessWidget {
  final double size;
  final Color? color;
  final double strokeWidth;
  final String? message;
  final TextStyle? messageStyle;

  const LoadingIndicator({
    Key? key,
    this.size = 40.0,
    this.color,
    this.strokeWidth = 4.0,
    this.message,
    this.messageStyle,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
            width: size,
            height: size,
            child: CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(
                color ?? AppColors.primary,
              ),
              strokeWidth: strokeWidth,
            ),
          ),
          if (message != null) ...[  
            const SizedBox(height: 16),
            Text(
              message!,
              style: messageStyle ?? 
                TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 16,
                ),
              textAlign: TextAlign.center,
            ),
          ],
        ],
      ),
    );
  }
}